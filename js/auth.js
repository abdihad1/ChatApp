import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

export function protectPage() {

    onAuthStateChanged(auth, (user) => {

        if (!user) {

            window.location.href = "login.html";

        }

    });

}

export function getCurrentUser() {

    return auth.currentUser;

}