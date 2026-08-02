const CACHE_NAME = "chativo-v19";

const FILES_TO_CACHE = [
    "/",
    "/chat.html",
    "/login.html",
    "/signup.html",
    "/css/style.css",
    "/css/modern.css",
    "/manifest.json"
];

// Install
self.addEventListener("install", (event) => {

    self.skipWaiting();

    event.waitUntil(

        caches.open(CACHE_NAME).then((cache) => {

            return cache.addAll(FILES_TO_CACHE);

        })

    );

});

// Activate
self.addEventListener("activate", (event) => {

    event.waitUntil(

        caches.keys().then((cacheNames) => {

            return Promise.all(

                cacheNames.map((cache) => {

                    if (cache !== CACHE_NAME) {

                        return caches.delete(cache);

                    }

                })

            );

        }).then(() => self.clients.claim())

    );

});

// Fetch
self.addEventListener("fetch", (event) => {

    const url = new URL(event.request.url);

    // Never cache Firebase or Google requests
    if (
        url.hostname.includes("googleapis.com") ||
        url.hostname.includes("gstatic.com") ||
        url.hostname.includes("firebase")
    ) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );

});