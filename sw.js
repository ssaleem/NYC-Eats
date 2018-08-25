self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/index.html',
        '/css/styles.css',
        '/js/main.js',
      ]);
    })
  );
});


self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    if (response) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        //clone to return and cache
        let responseClone = response.clone();

        caches.open('v1').then(function (cache) {
          cache.put(event.request, responseClone);
          console.log(`in cache put ${event.request.url}`);
        });
        return response;
      });
    }
  }));
});