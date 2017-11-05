let resources = [
    '/Werwolf/werwolf.html',
    '/Werwolf/style.css',
    '/Werwolf/werwolf-data.js',
    '/Werwolf/manifest.json',
    '/Werwolf/icons/wolf.png',
    '/Werwolf/icons/townsfolk.png',
    '/Werwolf/icons/werewolf.png',
    '/Werwolf/icons/witch.png',
    '/Werwolf/icons/seer.png',
    '/Werwolf/icons/cupid.png',
    '/Werwolf/icons/harlot.png',
    '/Werwolf/icons/add_player.png',
    '/Werwolf/icons/norole.svg',
    '/Werwolf/icons/Skull and Void.otf'
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