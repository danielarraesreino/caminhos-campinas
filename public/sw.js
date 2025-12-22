const CACHE_NAME = "caminhos-campinas-v1";
const ASSETS_TO_CACHE = [
    "/",
    "/manifest.json",
    "/globe.svg",
    "/next.svg",
    "/vercel.svg"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                // Fallback or handle offline silently
            });
        })
    );
});
