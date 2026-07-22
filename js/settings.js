import { auth, db } from "./firebase.js";
import { showToast } from "./toast.js";
import { uploadProfileImage } from "./profile.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const profilePreview = document.getElementById("profilePreview");
const displayName = document.getElementById("displayName");
const bio = document.getElementById("bio");
const email = document.getElementById("email");
const profileImage = document.getElementById("profileImage");
const saveProfile = document.getElementById("saveProfile");
const changePhotoBtn = document.getElementById("changePhotoBtn");

changePhotoBtn.onclick = () => {

    profileImage.click();

};

profilePreview.onclick = () => {

    profileImage.click();

};

profileImage.onchange = () => {

    const file = profileImage.files[0];

    if (!file) return;

    profilePreview.src = URL.createObjectURL(file);

};

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

saveProfile.disabled = true;
saveProfile.textContent = "Saving...";

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

    showToast("✅ Profile updated!");

    saveProfile.disabled = false;
saveProfile.textContent = "Save Changes";

setTimeout(() => {

    window.location.href = "chat.html";

}, 1000);

};