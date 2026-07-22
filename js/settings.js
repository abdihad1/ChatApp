import { auth, db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const profilePreview = document.getElementById("profilePreview");
const displayName = document.getElementById("displayName");
const bio = document.getElementById("bio");
const email = document.getElementById("email");

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    email.value = user.email;

    const snap = await getDoc(
        doc(db, "users", user.uid)
    );

    if (!snap.exists()) return;

    const data = snap.data();

    displayName.value = data.name || "";

    bio.value = data.bio || "";

    if (data.photo) {

        profilePreview.src = data.photo;

    }

});