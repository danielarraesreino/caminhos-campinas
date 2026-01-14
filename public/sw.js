const CACHE_NAME = "caminhos-campinas-v2";
const AUDIO_CACHE = "caminhos-audio-v1";

const ASSETS_TO_CACHE = [
	"/",
	"/manifest.json",
	"/globe.svg",
	"/vercel.svg",
	"/data/services-campinas.json", // Garante que os dados do mapa fiquem offline
];

// Audio files que serão pré-cacheados (adicione conforme necessário)
const AUDIO_FILES = [
	// Placeholder - adicionar arquivos reais quando disponíveis
	// "/audio/bom_prato_ambiente.mp3",
	// "/audio/praca_noite.mp3",
];

self.addEventListener("install", (event) => {
	event.waitUntil(
		Promise.all([
			caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)),
			caches.open(AUDIO_CACHE).then((cache) => {
				// Só adiciona se houver arquivos de áudio
				if (AUDIO_FILES.length > 0) {
					return cache.addAll(AUDIO_FILES);
				}
				return Promise.resolve();
			}),
		]),
	);
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keyList) =>
				Promise.all(
					keyList
						.filter((key) => key !== CACHE_NAME && key !== AUDIO_CACHE)
						.map((key) => caches.delete(key)),
				),
			)
			.then(() => {
				// [HARDENING] Take control of all clients immediately
				return self.clients.claim();
			}),
	);
});

self.addEventListener("fetch", (event) => {
	// Ignora requisições de API (Next.js) e extensões do Chrome
	if (
		event.request.url.includes("/api/") ||
		!event.request.url.startsWith("http")
	) {
		return;
	}

	const url = new URL(event.request.url);

	// ✅ DICEBEAR AVATARS - Cache-First para economia offline
	const isDiceBear = /^https:\/\/api\.dicebear\.com/.test(event.request.url);
	if (isDiceBear) {
		event.respondWith(
			caches.match(event.request).then((cachedResponse) => {
				if (cachedResponse) {
					console.log("[SW] DiceBear avatar served from cache:", url.pathname);
					return cachedResponse;
				}

				// Se não está no cache, busca da rede e cacheia
				return fetch(event.request)
					.then((networkResponse) => {
						if (!networkResponse || networkResponse.status !== 200) {
							return networkResponse;
						}

						const responseToCache = networkResponse.clone();
						caches.open(CACHE_NAME).then((cache) => {
							cache.put(event.request, responseToCache);
							console.log("[SW] DiceBear avatar cached:", url.pathname);
						});

						return networkResponse;
					})
					.catch(() => {
						console.warn("[SW] DiceBear avatar failed to load (offline):", url.pathname);
						// Retorna resposta vazia em caso de falha
						return new Response(null, {
							status: 503,
							statusText: "Service Unavailable",
						});
					});
			}),
		);
		return; // Early return para evitar fallthrough
	}

	const isAudioFile = /\.(mp3|wav|ogg|m4a|aac)$/i.test(url.pathname);

	if (isAudioFile) {
		// ✅ CACHE-FIRST para arquivos de áudio (Audio-First Strategy)
		event.respondWith(
			caches.match(event.request).then((cachedResponse) => {
				if (cachedResponse) {
					console.log("[SW] Audio served from cache:", url.pathname);
					return cachedResponse;
				}

				// Se não está no cache, busca da rede e cacheia
				return fetch(event.request)
					.then((networkResponse) => {
						if (!networkResponse || networkResponse.status !== 200) {
							return networkResponse;
						}

						const responseToCache = networkResponse.clone();
						caches.open(AUDIO_CACHE).then((cache) => {
							cache.put(event.request, responseToCache);
							console.log("[SW] Audio cached:", url.pathname);
						});

						return networkResponse;
					})
					.catch(() => {
						console.warn("[SW] Audio failed to load (offline):", url.pathname);
						// Retorna resposta vazia em caso de falha
						return new Response(null, {
							status: 503,
							statusText: "Service Unavailable",
						});
					});
			}),
		);
	} else {
		// Estratégia Stale-While-Revalidate para outros recursos
		event.respondWith(
			caches.match(event.request).then((cachedResponse) => {
				const fetchPromise = fetch(event.request)
					.then((networkResponse) => {
						if (
							!networkResponse ||
							networkResponse.status !== 200 ||
							networkResponse.type !== "basic"
						) {
							return networkResponse;
						}
						// CORREÇÃO CRÍTICA: Clonar antes de usar
						const responseToCache = networkResponse.clone();
						caches.open(CACHE_NAME).then((cache) => {
							cache.put(event.request, responseToCache);
						});
						return networkResponse;
					})
					.catch(() => {
						// Se falhar (offline), não faz nada (o cache já foi retornado se existir)
					});

				return cachedResponse || fetchPromise;
			}),
		);
	}
});
