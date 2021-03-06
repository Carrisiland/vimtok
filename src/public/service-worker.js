// vim: set ts=2 sw=2 et tw=80:

// DON'T MOVE THIS
// https://stackoverflow.com/questions/29874068

let user = null;

console.log('loading', self);

self.onmessage = (event) => {
  if (typeof event.data === 'object' && event.data.type === 'user') {
    user = event.data.data;
    console.log('service worker user', user);
  }
};

self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim()); // Become available to all pages
});

// Register event listener for the 'push' event.
self.addEventListener('push', (event) => {
  // Retrieve the textual payload from event.data (a PushMessageData object).
  // Other formats are supported (ArrayBuffer, Blob, JSON), check out the documentation
  // on https://developer.mozilla.org/en-US/docs/Web/API/PushMessageData.

  if (!event.data) return;
  const payload = event.data.json();
  console.log('notification payload', payload);
  console.log('user', user);

 // if (user && user._id != payload.userId) {
    // Keep the service worker alive until the notification is created.
    event.waitUntil(
      self.registration.showNotification('VimTok', {
        badge: payload.badge,
        url: payload.url,
        image: payload.badge,
        icon: payload.badge,
        body: payload.text,
      })
    );
  //}
});

