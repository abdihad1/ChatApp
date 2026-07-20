import { auth, provider } from "./firebase.js";
import { saveCurrentUser } from "./users.js";

import {
    signInWithEmailAndPassword,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Email Login
document.getElementById("loginBtn").onclick = async () => {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {

        await signInWithEmailAndPassword(auth, email, password);

        await saveCurrentUser();

        window.location.href = "chat.html";

    } catch (err) {

        alert(err.message);

    }

};

// Google Login
const googleBtn = document.getElementById("googleBtn");

if (googleBtn) {

    googleBtn.onclick = async () => {

        try {

            await signInWithPopup(auth, provider);

            await saveCurrentUser();

            window.location.href = "chat.html";

        } catch (err) {

            alert(err.message);

        }

    };

}