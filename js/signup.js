import { auth } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import { saveCurrentUser } from "./users.js";

document.getElementById("signupBtn").onclick = async () => {

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {

        const result = await createUserWithEmailAndPassword(auth, email, password);

        await updateProfile(result.user, {
            displayName: name
        });

        await saveCurrentUser();

        alert("Account Created!");

        window.location.href = "chat.html";

    } catch (err) {

        alert(err.message);

    }

};