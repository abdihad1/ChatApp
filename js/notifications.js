import { auth, db } from "./firebase.js";

import {
    getMessaging,
    getToken
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging.js";

import {
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";


const messaging = getMessaging();


export async function registerNotifications() {

    onAuthStateChanged(auth, async (user) => {

        if (!user) {
            console.log("No user logged in yet.");
            return;
        }


        const permission = await Notification.requestPermission();


        if (permission !== "granted") {

            console.log("Notification permission denied.");

            return;

        }


        const token = await getToken(messaging, {

            vapidKey: "BGzmph-FX3MzgIZN-S2WzyaXLxr-bZhdOSUjLJSTO9OMn6WxUQjm-_YsJkcdNStMWgOF2N4cVShw4KJwYbdFUTY"

        });


        if (!token) {

            console.log("No FCM token.");

            return;

        }


        console.log("FCM Token:", token);


        await updateDoc(
            doc(db, "users", user.uid),
            {
                fcmToken: token
            }
        );


    });

}