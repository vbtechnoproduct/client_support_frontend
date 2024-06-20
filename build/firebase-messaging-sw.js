// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyCb1yYvdVQWqk3_gamsmTzhatqy4blb7Ls",
    authDomain: "client-support-b2b3f.firebaseapp.com",
    projectId: "client-support-b2b3f",
    storageBucket: "client-support-b2b3f.appspot.com",
    messagingSenderId: "384862081102",
    appId: "1:384862081102:web:df1daf56fc0cdb1be1b31f",
    measurementId: "G-S9DM2GS1BW"
};


firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
