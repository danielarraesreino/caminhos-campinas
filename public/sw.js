const CACHE_NAME = "caminhos-campinas-v1";
const ASSETS_TO_CACHE = [
	"/",
	"/manifest.json",
	"/favicon.ico",
	"/globe.svg",
	"/next.svg",
	"/vercel.svg",
	// Placeholder sounds created previously
	"/sounds/chuva.mp3",
	"/sounds/transito.mp3",
	"/sounds/clique.mp3",
];

// Instalação: Cache inicial dos arquivos estáticos críticos
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log("[SW] Caching app shell");
			return cache.addAll(ASSETS_TO_CACHE);
		}),
	);
});

// Ativação: Limpeza de caches antigos
self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(
				keyList.map((key) => {
					if (key !== CACHE_NAME) {
						console.log("[SW] Removing old cache", key);
						return caches.delete(key);
					}
					return Promise.resolve();
				}),
			);
		}),
	);
	return self.clients.claim();
});

// Interceptação de Requisições (A Mágica do Mapa)
self.addEventListener("fetch", (event) => {
	const url = new URL(event.request.url);

	// ESTRATÉGIA PARA O MAPA (OpenStreetMap Tiles - Cache First)
	if (
		url.origin.includes("tile.openstreetmap.org") ||
		url.origin.includes("carto.com") ||
		url.origin.includes("mapbox.com")
	) {
		event.respondWith(
			caches.match(event.request).then((cachedResponse) => {
				if (cachedResponse) return cachedResponse;

				return fetch(event.request).then((networkResponse) => {
					// Check for valid response
					if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic" && networkResponse.type !== "cors" && networkResponse.type !== "opaque") {
						return networkResponse;
					}

					const responseToCache = networkResponse.clone();
					caches.open(CACHE_NAME).then((cache) => {
						cache.put(event.request, responseToCache);
					});
					return networkResponse;
				});
			}),
		);
		return;
	}

	// ESTRATÉGIA PADRÃO (Stale-While-Revalidate)
	event.respondWith(
		caches.match(event.request).then((cachedResponse) => {
			const fetchPromise = fetch(event.request)
				.then((networkResponse) => {
					// Safe cloning check
					if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
						return networkResponse;
					}

					const responseToCache = networkResponse.clone();
					caches.open(CACHE_NAME).then((cache) => {
						cache.put(event.request, responseToCache);
					});
					return networkResponse;
				})
				.catch(() => {
					// Fallback implies returning cachedResponse (handled below by logic)
					return cachedResponse;
				});

			return cachedResponse || fetchPromise;
		}),
	);
});
