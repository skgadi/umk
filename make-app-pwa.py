import os
import json
from pathlib import Path



DOCS_DIR = Path("docs")
OUTPUT_SW = DOCS_DIR / "service-worker.js"
OUTPUT_MANIFEST = DOCS_DIR / "manifest.json"
INDEX_FILE = DOCS_DIR / "index.html"


def get_all_files(base_path):
    files = []
    for root, _, filenames in os.walk(base_path):
        for filename in filenames:
            full_path = Path(root) / filename
            rel_path = full_path.relative_to(base_path)
            # Skip service worker itself (will be added manually)
            if "service-worker.js" in str(rel_path):
                continue
            files.append("/" + str(rel_path).replace("\\", "/"))
    return files


def create_manifest():
    manifest = {
        "name": "My PWA App",
        "short_name": "PWA",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#000000",
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
        ]
    }

    with open(OUTPUT_MANIFEST, "w") as f:
        json.dump(manifest, f, indent=2)

    print("✅ manifest.json created")


import hashlib

def generate_cache_name(files, base_path):
    hasher = hashlib.md5()

    for file in sorted(files):
        full_path = base_path / file.lstrip("/")
        if full_path.exists():
            with open(full_path, "rb") as f:
                hasher.update(f.read())

    return "pwa-cache-" + hasher.hexdigest()[:10]


def create_service_worker(files):
    cache_name = generate_cache_name(files, DOCS_DIR)

    sw_content = f"""
const CACHE_NAME = '{cache_name}';
const URLS_TO_CACHE = {json.dumps(files, indent=2)};

// Install
self.addEventListener('install', event => {{
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
}});

// Activate (delete old caches)
self.addEventListener('activate', event => {{
  event.waitUntil(
    caches.keys().then(cacheNames => {{
      return Promise.all(
        cacheNames.map(name => {{
          if (name !== CACHE_NAME) {{
            return caches.delete(name);
          }}
        }})
      );
    }})
  );
  self.clients.claim();
}});

// Fetch
self.addEventListener('fetch', event => {{
  event.respondWith(
    caches.match(event.request)
      .then(response => {{
        return response || fetch(event.request);
      }})
  );
}});
"""

    with open(OUTPUT_SW, "w") as f:
        f.write(sw_content.strip())

    print(f"✅ service-worker.js created with cache: {cache_name}")


def inject_into_index():
    if not INDEX_FILE.exists():
        print("❌ index.html not found")
        return

    with open(INDEX_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Inject manifest
    if 'rel="manifest"' not in content:
        content = content.replace(
            "</head>",
            '  <link rel="manifest" href="/manifest.json">\n</head>'
        )

    # Inject service worker registration
    if "serviceWorker.register" not in content:
        sw_script = """
<script>
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(() => console.log('SW registered'))
    .catch(err => console.log('SW error', err));
}
</script>
"""
        content = content.replace("</body>", sw_script + "\n</body>")

    with open(INDEX_FILE, "w", encoding="utf-8") as f:
        f.write(content)

    print("✅ index.html updated")


def main():
    if not DOCS_DIR.exists():
        print("❌ docs folder not found")
        return

    print("🔍 Scanning files...")
    files = get_all_files(DOCS_DIR)

    create_manifest()
    create_service_worker(files)
    inject_into_index()

    print(f"\n🎉 PWA setup complete! {len(files)} files cached.")


if __name__ == "__main__":
    main()