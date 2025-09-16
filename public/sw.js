// Service Worker for Nabha Healthcare Telemedicine App
// Provides offline functionality for rural areas with poor connectivity

const CACHE_NAME = 'nabha-healthcare-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        // For API calls, return a fallback response when offline
        if (event.request.url.includes('/api/')) {
          return new Response(JSON.stringify({
            error: 'Offline',
            message: 'This feature requires internet connection'
          }), {
            headers: { 'Content-Type': 'application/json' },
            status: 503
          });
        }
        
        return fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for health records
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-health-records') {
    event.waitUntil(syncHealthRecords());
  }
});

// Sync health records when connection is restored
function syncHealthRecords() {
  return new Promise((resolve) => {
    // Get pending records from IndexedDB
    const records = JSON.parse(localStorage.getItem('nabha-health-records') || '[]');
    const pendingRecords = records.filter(record => record.sync_status === 'pending' || record.sync_status === 'offline');
    
    if (pendingRecords.length > 0) {
      console.log('Syncing', pendingRecords.length, 'health records');
      
      // Simulate API sync (would be actual API calls in production)
      pendingRecords.forEach(record => {
        record.sync_status = 'synced';
      });
      
      // Update localStorage
      const updatedRecords = records.map(record => {
        const pending = pendingRecords.find(p => p.id === record.id);
        return pending ? pending : record;
      });
      
      localStorage.setItem('nabha-health-records', JSON.stringify(updatedRecords));
    }
    
    resolve();
  });
}

// Push notifications for telemedicine appointments
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from Nabha Healthcare',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'close', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Nabha Healthcare', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});