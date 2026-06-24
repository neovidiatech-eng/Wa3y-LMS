importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCLh5Kor4b6Pz3GLGqfM-S5gFdoCG6cQWs",
  authDomain: "wa3y-notification.firebaseapp.com",
  projectId: "wa3y-notification",
  storageBucket: "wa3y-notification.firebasestorage.app",
  messagingSenderId: "613296187597",
  appId: "1:613296187597:web:3ed290e010a8fa48106184",
  measurementId: "G-KZDW12FHNC"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png' // Ensure there's a logo or default icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
