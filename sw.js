/* Cache por escopo: os aplicativos dos dois cemitérios ficam separados. */
const PREFIX = 'memorial-totem-' + encodeURIComponent(self.registration.scope) + '-';
const CACHE = PREFIX + 'v2';
const FILES = ['./','./index.html','./style.css','./app.js','./config.js','./totem.css','./totem.js','./logo.png','./dados.json','./localizacoes.json','./manifest.webmanifest','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png'];
const ALLOWED = new Set(FILES.map(file => new URL(file, self.registration.scope).href));
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Google Maps e demais recursos externos não são armazenados.
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  const normalized = new URL(url.href); normalized.search = ''; normalized.hash = '';
  if (!ALLOWED.has(normalized.href)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(event.request);
      if (response.ok) await cache.put(normalized.href, response.clone());
      return response;
    } catch {
      return await cache.match(normalized.href) || new Response('Recurso indisponível sem conexão. Reconecte e atualize a página.', {status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
    }
  })());
});
