import { auth, db } from "./firebase.js";
import { saveCurrentUser } from "./users.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const loginBtn = document.getElementById("loginBtn");

loginBtn.onclick = async () => {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please enter email and password.");
        return;
    }

    try {

        const result = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = result.user;

        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
            alert("User profile not found.");
            return;
        }

        await saveCurrentUser();

        window.location.href = "chat.html";

    } catch (err) {

        alert(err.message);

    }

};

document.getElementById("createAccountBtn").onclick = () => {
    window.location.href = "signup.html";
};