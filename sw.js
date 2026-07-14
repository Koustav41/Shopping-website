const CACHE_NAME = 'tech-world-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/cart.html',
    '/login.html',
    '/signup.html',
    '/admin.html',
    '/admin-login.html',
    '/admin-register.html',
    '/view orders.html',
    '/style.css',
    '/script.js',
    '/theme.js',
    '/login.js',
    '/signup.js',
    '/manifest.webmanifest',
    '/image/icon-192.png',
    '/image/icon-512.png'
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching all static assets');
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting())
    );
});

// Activate Event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] Clearing old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Bypass caching for API requests and non-GET requests
    if (url.pathname.startsWith('/api') || event.request.method !== 'GET') {
        event.respondWith(fetch(event.request));
        return;
    }

    // Network first, falling back to cache strategy for HTML/JS/CSS to ensure latest updates
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // If valid response, clone it and update cache
                if (response && response.status === 200 && response.type === 'basic') {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // If offline, return from cache
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // If offline and request is for a page, return index.html fallback
                    if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
                        return caches.match('/index.html');
                    }
                });
            })
    );
});
