let resources = [
    '/werwolf.html',
    '/style.css',
    '/werwolf-data.js',
    '/manifest.json',
    '/icons/wolf.png',
    '/icons/townsfolk.png',
    '/icons/werewolf.png',
    '/icons/witch.png',
    '/icons/seer.png',
    '/icons/cupid.png',
    '/icons/harlot.png',
    '/icons/add_player.png',
    '/icons/norole.svg',
    '/icons/Skull and Void.otf'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('werwolf').then(function(cache) {
      return cache.addAll(resources);
    })
  );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(res => {
            return res || fetch(e.request).then(response => {
                return caches.open('werwolf').then(cache => {
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(resp) {
            return resp || fetch(event.request).then(function(response) {
                return caches.open('werwolf').then(function(cache) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});