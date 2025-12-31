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

	// ESTRATÉGIA PARA O MAPA (OpenStreetMap Tiles)
	// Se a URL for de um tile do mapa (a.tile.openstreetmap.org...), cacheia!
	if (
		url.origin.includes("tile.openstreetmap.org") ||
		url.origin.includes("carto.com") ||
		url.origin.includes("mapbox.com")
	) {
		event.respondWith(
			caches.match(event.request).then((cachedResponse) => {
				// Se já tem no cache (offline ou já visitado), retorna do cache
				if (cachedResponse) {
					return cachedResponse;
				}

				// Se não tem, busca na rede, retorna pro usuário E salva no cache pra depois
				return fetch(event.request).then((networkResponse) => {
					return caches.open(CACHE_NAME).then((cache) => {
						const responseToCache = networkResponse.clone();
						cache.put(event.request, responseToCache);
						return networkResponse;
					});
				});
			}),
		);
		return; // Encerra aqui para tiles de mapa
	}

	// ESTRATÉGIA PADRÃO (Stale-While-Revalidate para o resto)
	event.respondWith(
		caches.match(event.request).then((cachedResponse) => {
			const fetchPromise = fetch(event.request)
				.then((networkResponse) => {
					caches.open(CACHE_NAME).then((cache) => {
						cache.put(event.request, networkResponse.clone());
					});
					return networkResponse;
				})
				.catch(() => {
					// Se falhar (offline total), tenta retornar o cache
					return cachedResponse;
				});

			// Retorna o cache primeiro (velocidade), atualiza em background
			return cachedResponse || fetchPromise;
		}),
	);
});
