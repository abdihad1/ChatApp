import { auth, db } from "./firebase.js";
import { uploadProfileImage } from "./profile.js";

import {
    doc,
    getDoc
    updateDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const profilePreview = document.getElementById("profilePreview");
const displayName = document.getElementById("displayName");
const bio = document.getElementById("bio");
const email = document.getElementById("email");
const profileImage = document.getElementById("profileImage");
const saveProfile = document.getElementById("saveProfile");

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

saveProfile.onclick = async () => {

    const user = auth.currentUser;

    if (!user) return;

    let photoUrl = null;

    if (profileImage.files.length > 0) {

        photoUrl = await uploadProfileImage(
            profileImage.files[0],
            user.uid
        );

    }

    await updateDoc(
        doc(db, "users", user.uid),
        {
            name: displayName.value.trim(),
            bio: bio.value.trim(),
            ...(photoUrl && { photo: photoUrl })
        }
    );

    alert("✅ Profile updated!");

};