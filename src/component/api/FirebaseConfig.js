import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCF4UqndUfFeQ6a-VeoXgmJG3EJiSBYi9o",
    authDomain: "clientsupport-74a30.firebaseapp.com",
    projectId: "clientsupport-74a30",
    storageBucket: "clientsupport-74a30.appspot.com",
    messagingSenderId: "114230136229",
    appId: "1:114230136229:web:5e18f4935107e8814bec4c",
    measurementId: "G-H0XQJHVDBG"
};

const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

const publicKey =
    "BMjyHMT3qkChlNIGZSTLL4iU2E-hKD9GuUohU-pLc0GOK02zjtf4EjOM2DaPFpI028hItXBqa9-OHi06ZBa9YWQ";

export const requestForToken = () => {
    return getToken(messaging, { vapidKey: publicKey })
        .then((currentToken) => {
            if (currentToken) {
                sessionStorage.setItem("FCMToken", JSON.stringify(currentToken));
            } else {
                console.log("No registration token available. Request permission to generate one.");
            }
        })
        .catch((err) => {
            console.log("An error occurred while retrieving token. ", err);
        });
};

export const onMessageListener = () => {
    return new Promise((resolve, reject) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });
};


// export const requestNotificationPermission = () => {
//     return Notification.requestPermission().then((permission) => {
//         if (permission === "granted") {
//             return requestForToken();
//         } else {
//             throw new Error("Notification permission denied.");
//         }
//     });
// };


// export const Sendrequest = () => {
//     console.log("Requesting User Permission......");
//     Notification.requestPermission().then((permission) => {
//         if (permission === "granted") {
//             console.log("Notification User Permission Granted.");

//             return getToken(messaging, { vapidKey: publicKey })
//                 .then((currentToken) => {
//                     if (currentToken) {
//                         console.log('Client Token: ', currentToken);

//                     } else {

//                         console.log('Failed to generate the registration token.');
//                     }
//                 })
//                 .catch((err) => {
//                     console.log('An error occurred when requesting to receive the token.', err);
//                 });
//         } else {
//             console.log("User Permission Denied.");
//         }
//     });
// }

