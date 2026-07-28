import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

document.getElementById("signupBtn").onclick = async () => {

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!name || !email || !password) {
        alert("Please fill all fields.");
        return;
    }

    try {

        const result = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = result.user;

        await updateProfile(user, {
            displayName: name
        });

        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: name,
            email: email,
            photo: "",
            bio: "",
            online: true,
            createdAt: serverTimestamp()
        });

        alert("Account created successfully!");

        window.location.href = "login.html";

    } catch (err) {
        alert(err.message);
    }

};