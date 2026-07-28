import { auth, db } from "./firebase.js";
import { saveCurrentUser } from "./users.js";

import {
    RecaptchaVerifier,
    signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

window.recaptchaVerifier = new RecaptchaVerifier(
    auth,
    "recaptcha-container",
    {
        size: "normal"
    }
);

const sendOtpBtn = document.getElementById("sendOtpBtn");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");

let confirmationResult = null;

sendOtpBtn.onclick = async () => {

    const phoneNumber =
        document.getElementById("phoneNumber").value.trim();

    try {

        confirmationResult =
            await signInWithPhoneNumber(
                auth,
                phoneNumber,
                window.recaptchaVerifier
            );

        alert("OTP sent.");

        document.getElementById("otpCode").style.display = "block";
        verifyOtpBtn.style.display = "block";

    } catch (err) {

        alert(err.message);

    }

};

verifyOtpBtn.onclick = async () => {

    const code =
        document.getElementById("otpCode").value.trim();

    try {

        const result =
            await confirmationResult.confirm(code);

        const user = result.user;

        const userRef = doc(db, "users", user.uid);

        const snap = await getDoc(userRef);

        if (!snap.exists()) {

            await setDoc(userRef, {
                uid: user.uid,
                phone: user.phoneNumber,
                name: user.phoneNumber,
                photo: "",
                bio: "",
                online: true,
                createdAt: serverTimestamp()
            });

        }

        await saveCurrentUser();

        window.location.href = "chat.html";

    } catch (err) {

        alert("Invalid OTP");

    }

};