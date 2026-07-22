importScripts("https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyBhm6xKLWRsNXGyWW9IW610vchCd5TC3mw",
  authDomain: "chatapp-b85e6.firebaseapp.com",
  projectId: "chatapp-b85e6",
  storageBucket: "chatapp-b85e6.firebasestorage.app",
  messagingSenderId: "21694923759",
  appId: "1:21694923759:web:9177ef5c8f7e120f096c1a",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

    self.registration.showNotification(
        payload.notification.title,
        {
            body: payload.notification.body,
            icon: "/favicon.png"
        }
    );

});