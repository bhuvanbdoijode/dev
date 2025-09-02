// sw.js
self.addEventListener("install", (event) => {
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle incoming push messages from your server (e.g., FCM, Web Push)
self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) {}
  const title = data.title || "Reminder";
  const body = data.body || "You have a new reminder!";
  const options = {
    body,
    icon: "icon.png",   // optional – add an icon file for nicer notifications
    badge: "icon.png",
    tag: "timetable-reminder",
    renotify: true
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Optional: handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    (async () => {
      const allClients = await clients.matchAll({ type: "window", includeUncontrolled: true });
      if (allClients.length) {
        const client = allClients[0];
        client.focus();
      } else {
        clients.openWindow("./");
      }
    })()
  );
});
