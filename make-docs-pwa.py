import os
import json
from pathlib import Path
import hashlib

DOCS_DIR = Path("./docs")

APP_NAME = "Uyamak"
SHORT_NAME = "Umk"

IGNORE_EXT = {".map", ".tmp"}

# -----------------------
# Get all files
# -----------------------
def get_files():
    files = []
    for path in DOCS_DIR.rglob("*"):
        if path.is_file() and path.suffix not in IGNORE_EXT:
            rel = "/" + str(path.relative_to(DOCS_DIR)).replace("\\", "/")
            files.append(rel)
    return sorted(files)

# -----------------------
# Version hash
# -----------------------
def get_version(files):
    h = hashlib.md5()
    for f in files:
        h.update(f.encode())
    return h.hexdigest()[:10]

# -----------------------
# Create manifest
# -----------------------
def create_manifest():
    manifest = {
        "name": APP_NAME,
        "short_name": SHORT_NAME,
        "start_url": "/",
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#ffffff",
        "icons": [
            {
                "src": "/images/umk-logo-192-192.png",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": "/images/umk-logo.png",
                "sizes": "512x512",
                "type": "image/png"
            }
        ],
        "screenshots": [
            {
                "src": "/images/screenshot-wide.png",
                "sizes": "1280x720",
                "type": "image/png",
                "form_factor": "wide"
            },
            {
                "src": "/images/screenshot-mobile.png",
                "sizes": "720x1280",
                "type": "image/png"
            }
        ]
    }

    with open(DOCS_DIR / "manifest.json", "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

# -----------------------
# Create Service Worker
# -----------------------
def create_sw(files):
    version = get_version(files)
    cache_name = f"pwa-{version}"

    sw = f"""
const CACHE_NAME = "{cache_name}";
const FILES = {json.dumps(files, indent=2)};

// INSTALL
self.addEventListener("install", event => {{
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {{
      for (const url of FILES) {{
        try {{
          const res = await fetch(url);
          if (!res.ok) throw new Error("Bad response");
          await cache.put(url, res.clone());
        }} catch (err) {{
          console.warn("Skipped:", url);
        }}
      }}
    }})
  );
  self.skipWaiting();
}});

// ACTIVATE
self.addEventListener("activate", event => {{
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME)
            .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();

  // Notify clients app is ready
  self.clients.matchAll().then(clients => {{
    clients.forEach(client => {{
      client.postMessage({{ type: "READY" }});
    }});
  }});
}});

// FETCH (FIXED)
self.addEventListener("fetch", event => {{
  const req = event.request;

  // ✅ Only GET
  if (req.method !== "GET") return;

  // ✅ Only http/https
  if (!req.url.startsWith("http")) return;

  // Navigation
  if (req.mode === "navigate") {{
    event.respondWith(
      fetch(req)
        .then(res => {{
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy));
          return res;
        }})
        .catch(() => caches.match("/index.html"))
    );
    return;
  }}

  // Assets
  event.respondWith(
    caches.match(req).then(res => {{
      return res || fetch(req).then(net => {{
        if (!net || net.status !== 200) return net;

        return caches.open(CACHE_NAME).then(c => {{
          c.put(req, net.clone());
          return net;
        }});
      }});
    }})
  );
}});
"""

    with open(DOCS_DIR / "service-worker.js", "w", encoding="utf-8") as f:
        f.write(sw)

# -----------------------
# Inject into HTML
# -----------------------
def inject():
    for html in DOCS_DIR.rglob("*.html"):
        text = html.read_text(encoding="utf-8")

        if 'manifest.json' not in text:
            text = text.replace(
                "</head>",
                '<link rel="manifest" href="/manifest.json">\n</head>'
            )

        if 'serviceWorker.register' not in text:
            script = """
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(reg => {

      // READY MESSAGE
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'READY') {
          alert("✅ App is ready for offline use!");
        }
      });

      // UPDATE DETECTED
      reg.onupdatefound = () => {
        const newWorker = reg.installing;
        newWorker.onstatechange = () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            alert("🔄 New version available. Refresh to update.");
          }
        };
      };

    });
  });
}
</script>
"""
            text = text.replace("</body>", script + "\n</body>")

        html.write_text(text, encoding="utf-8")

# -----------------------
# MAIN
# -----------------------
if __name__ == "__main__":
    print("Scanning files...")
    files = get_files()

    print("Creating manifest...")
    create_manifest()

    print("Creating service worker...")
    create_sw(files)

    print("Injecting into HTML...")
    inject()

    print("✅ DONE! Your site is now a production-ready PWA.")