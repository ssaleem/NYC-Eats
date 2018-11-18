self.addEventListener('install', function(event) {
  //waituntil() keeps track of installation progress
  //waitUntil takes a promise
  event.waitUntil(
    caches.open('nyceats-v1')
    .then(function(cache) {
      //addAll() uses fetch under the hood
      return cache.addAll([
        // './index.html'
        '/NYC-Eats/index.html',
        '/NYC-Eats/css/styles.css',
        '/NYC-Eats/js/main.js'
      ]);
    })
  );
});


self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    //serve the response from cache
    if (response) return response;
    else {
      //no match is found for requested asset(the Promise resolved to undefined)
      //fetch resource from network and cache
      return fetch(event.request)
      .then(function (response) {
        // response may be used only once
        // save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();
        caches.open('nyceats-v1').then(function (cache) {
          cache.put(event.request, responseClone);
          // console.log(`in cache put ${event.request.url}`);
          // console.log(new Map(responseClone.headers));
        });

        return response;
      });
    }
  }));
});