var CACHE_NAME = 'disco-anexo-v1';
var ASSETS = [
  '/',
  '/index.html',
  '/estilo.css',
  '/main.js',
  '/manifest.json',
  '/imgs/tapa-disco.jpg',
  '/imgs/contratapa-disco.jpg',
  '/imgs/logo-anexo.png',
  '/tracks/ludopatovsky.mp3',
  '/tracks/nunca-mas.mp3',
  '/tracks/boton-y-peronista.mp3',
  '/tracks/calvicio.mp3',
  '/tracks/la-vuelta-ra.mp3',
  '/tracks/endiablado.mp3',
  '/tracks/el-virgotas.mp3',
  '/tracks/soldado-caido.mp3',
  '/tracks/ratami.mp3',
  '/tracks/parimbolas.mp3',
  '/tracks/decime-larvi.mp3',
  '/tracks/mora-dame-bola.mp3',
  '/tracks/sexo-en-el-anexo.mp3',
  '/tracks/nunca-mas-alternativo.mp3'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(name) { return name !== CACHE_NAME; })
          .map(function(name) { return caches.delete(name); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      return cached || fetch(event.request).then(function(response) {
        /* Cachear nuevas requests dinámicamente */
        if (response.ok) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(function() {
        /* Offline y no en caché: devolver la página principal */
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
