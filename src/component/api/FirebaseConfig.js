    import { initializeApp } from "firebase/app";
    import { getMessaging, getToken, onMessage } from "firebase/messaging";

    // // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyCb1yYvdVQWqk3_gamsmTzhatqy4blb7Ls",
        authDomain: "client-support-b2b3f.firebaseapp.com",
        projectId: "client-support-b2b3f",
        storageBucket: "client-support-b2b3f.appspot.com",
        messagingSenderId: "384862081102",
        appId: "1:384862081102:web:df1daf56fc0cdb1be1b31f",
        measurementId: "G-S9DM2GS1BW"
    };

    const app = initializeApp(firebaseConfig);

    const messaging = getMessaging(app);

    const publicKey =
        "BIIW2ZXau0LjA0ei6e5bGN2aQ2339qZUMoLFOg5pXOqARTWekzwkoZiHHxNOswBTviAZh9NrBG9fq0oyJSD4joE";

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

