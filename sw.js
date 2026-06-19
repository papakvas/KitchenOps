// ═══════════════════════════════════════════════════════════════════════════
// KitchenOPS — Service Worker
// ═══════════════════════════════════════════════════════════════════════════
// Scope: /Kitchenops/  (matches GitHub Pages deploy path)
//
// Strategy:
//   • HTML (the app shell)  → network-first, cache fallback
//     (so updates ship immediately when online, but offline still works)
//   • Static assets (icons, manifest) → cache-first
//   • Supabase API + any other origin → ignored, request passes through
//
// To force-update clients: bump CACHE_VERSION below in every release.
// ═══════════════════════════════════════════════════════════════════════════

const CACHE_VERSION = 'kc-v2-2026-06-18';
const PRECACHE_URLS = [
  '/Kitchenops/KitchenOPS-cloud.html',
  '/Kitchenops/config.js',
  '/Kitchenops/manifest.json',
  '/Kitchenops/icon-192.png',
  '/Kitchenops/icon-512.png',
  '/Kitchenops/icon-512-maskable.png',
  '/Kitchenops/apple-touch-icon.png',
  '/Kitchenops/favicon-32.png',
  '/Kitchenops/favicon-16.png',
];

// ── Install: prefill the cache with the app shell ──────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())  // activate this SW immediately
  );
});

// ── Activate: purge old caches ─────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: route by request type ───────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle our own origin (GitHub Pages). Skip everything else
  // (Supabase API, Google Fonts CSS we'd want fresh, etc.)
  if (url.origin !== self.location.origin) return;

  // Only handle requests within our scope
  if (!url.pathname.startsWith('/Kitchenops/')) return;

  // Only GET requests are cacheable
  if (req.method !== 'GET') return;

  // HTML → network-first
  const isHTML = req.mode === 'navigate' || url.pathname.endsWith('.html');
  if (isHTML) {
    event.respondWith(networkFirst(req));
    return;
  }

  // Everything else within scope → cache-first
  event.respondWith(cacheFirst(req));
});

async function networkFirst(req) {
  try {
    const res = await fetch(req);
    if (res && res.status === 200) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(req, res.clone());
    }
    return res;
  } catch {
    const cached = await caches.match(req);
    if (cached) return cached;
    // No network AND no cached copy → still try the shell as fallback
    const shell = await caches.match('/Kitchenops/KitchenOPS-cloud.html');
    if (shell) return shell;
    throw new Error('No network and no cached response');
  }
}

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && res.status === 200) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(req, res.clone());
    }
    return res;
  } catch (err) {
    throw err;
  }
}

// ── Message channel: let the page tell us to skipWaiting on update ─────────
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
