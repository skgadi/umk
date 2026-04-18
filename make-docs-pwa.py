import json
from pathlib import Path
import hashlib

DOCS_DIR = Path("./docs")

APP_NAME = "Uyamak"
SHORT_NAME = "Uyamak"

IGNORE_EXT = {".map", ".tmp", ".DS_Store"}


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

// INSTALL (progress + safe caching)
self.addEventListener("install", event => {{
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {{
      let completed = 0;

      for (const url of FILES) {{
        try {{
          const res = await fetch(url);
          if (!res.ok || res.status === 206) throw new Error();
          await cache.put(url, res.clone());
        }} catch (e) {{
          console.warn("Skipped:", url);
        }}

        completed++;

        const clients = await self.clients.matchAll();
        clients.forEach(client => {{
          client.postMessage({{
            type: "CACHE_PROGRESS",
            done: completed,
            total: FILES.length
          }});
        }});
      }}

      const clients = await self.clients.matchAll();
      clients.forEach(client => {{
        client.postMessage({{ type: "CACHE_COMPLETE" }});
      }});
    }})
  );

  self.skipWaiting();
}});

// ACTIVATE (cleanup + update notify)
self.addEventListener("activate", event => {{
  event.waitUntil(
    caches.keys().then(async keys => {{
      await Promise.all(
        keys.filter(k => k !== CACHE_NAME)
            .map(k => caches.delete(k))
      );

      const clients = await self.clients.matchAll();
      clients.forEach(client => {{
        client.postMessage({{ type: "NEW_VERSION" }});
      }});
    }})
  );

  self.clients.claim();
}});

// FETCH (SAFE)
self.addEventListener("fetch", event => {{
  const req = event.request;

  // Ignore non-GET
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Ignore unsupported schemes
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  // Optional: restrict to same origin
  if (url.origin !== self.location.origin) return;

  // Navigation
  if (req.mode === "navigate") {{
    event.respondWith(
      fetch(req)
        .then(res => {{
          if (res.status === 206) return res;
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy));
          return res;
        }})
        .catch(() => caches.match("/index.html"))
    );
    return;
  }}

  // Static assets
  event.respondWith(
    caches.match(req).then(res => {{
      if (res) return res;

      return fetch(req).then(net => {{
        if (!net.ok || net.status === 206) return net;

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
# Inject UI
# -----------------------
def inject():
    ui = """
<link rel="manifest" href="/manifest.json">

<div id="pwa-status" style="
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: #222;
  color: white;
  padding: 15px;
  border-radius: 10px;
  font-family: sans-serif;
  z-index: 9999;
  display: none;
">
  <div id="pwa-text">Installing...</div>
  <div style="background:#555; height:6px; border-radius:5px; margin-top:8px;">
    <div id="pwa-bar" style="
      height:6px;
      width:0%;
      background:#4caf50;
      border-radius:5px;
      transition: width 0.2s;
    "></div>
  </div>
</div>

<script>
const box = document.getElementById("pwa-status");
const text = document.getElementById("pwa-text");
const bar = document.getElementById("pwa-bar");

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');

  navigator.serviceWorker.addEventListener('message', event => {
    const data = event.data;

    if (data.type === "CACHE_PROGRESS") {
      box.style.display = "block";
      const percent = Math.round((data.done / data.total) * 100);
      text.innerText = "Installing... " + percent + "%";
      bar.style.width = percent + "%";
    }

    if (data.type === "CACHE_COMPLETE") {
      text.innerText = "Offline ready!";
      bar.style.width = "100%";
      setTimeout(() => box.style.display = "none", 3000);
    }

    if (data.type === "NEW_VERSION") {
      box.style.display = "block";
      text.innerText = "New version updated!";
      bar.style.width = "100%";
      setTimeout(() => box.style.display = "none", 4000);
    }
  });
}
</script>
"""

    for html in DOCS_DIR.rglob("*.html"):
        content = html.read_text(encoding="utf-8")

        if "service-worker.js" not in content:
            content = content.replace("</body>", ui + "\n</body>")

        html.write_text(content, encoding="utf-8")


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

    print("Injecting UI...")
    inject()

    print("✅ DONE! Your PWA is fully ready.")