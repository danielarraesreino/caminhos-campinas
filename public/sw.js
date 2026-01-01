const CACHE_NAME = "caminhos-campinas-v2";
const ASSETS_TO_CACHE = [
	"/",
	"/manifest.json",
	"/globe.svg",
	"/vercel.svg",
	"/data/services-campinas.json" // Garante que os dados do mapa fiquem offline
];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
	);
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((keyList) =>
			Promise.all(
				keyList.map((key) => {
					if (key !== CACHE_NAME) return caches.delete(key);
				})
			)
		)
	);
	return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
	// Ignora requisições de API (Next.js) e extensões do Chrome
	if (event.request.url.includes("/api/") || !event.request.url.startsWith("http")) {
		return;
	}

	event.respondWith(
		caches.match(event.request).then((cachedResponse) => {
			// Estratégia Stale-While-Revalidate
			const fetchPromise = fetch(event.request).then((networkResponse) => {
				if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
					return networkResponse;
				}
				// CORREÇÃO CRÍTICA: Clonar antes de usar
				const responseToCache = networkResponse.clone();
				caches.open(CACHE_NAME).then((cache) => {
					cache.put(event.request, responseToCache);
				});
				return networkResponse;
			}).catch(() => {
				// Se falhar (offline), não faz nada (o cache já foi retornado se existir)
			});

			return cachedResponse || fetchPromise;
		})
	);
});
