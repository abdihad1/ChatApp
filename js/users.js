import { auth, db } from "./firebase.js";
import { updateDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
    doc,
    setDoc,
    serverTimestamp,
    getDoc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Save current user
export async function saveCurrentUser() {

    const user = auth.currentUser;

    if (!user) return;

    await setDoc(
        doc(db, "users", user.uid),
        {
            uid: user.uid,
            name: user.displayName || "",
            email: user.email || "",
            photo: user.photoURL || "",
            lastSeen: serverTimestamp()
        },
        { merge: true }
    );

}

// Get one user
export async function getUser(uid) {

    const snap = await getDoc(doc(db, "users", uid));

    if (snap.exists()) {
        return snap.data();
    }

    return null;

}

// Get all users
export async function getAllUsers() {

    const snapshot = await getDocs(collection(db, "users"));

    const users = [];

    snapshot.forEach((doc) => {
        users.push(doc.data());
    });

    return users;

}
    export async function setOnlineStatus(status) {

    if (!auth.currentUser) return;

    await updateDoc(
        doc(db, "users", auth.currentUser.uid),
        {
            online: status,
            lastSeen: serverTimestamp()
        }
    );

}