import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    doc,
    updateDoc,
    serverTimestamp,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Create a new call
export async function createCall(callerUid, receiverUid) {

    const callRef = await addDoc(
        collection(db, "calls"),
        {
            caller: callerUid,
            receiver: receiverUid,
            status: "calling",
            offer: null,
            answer: null,
            createdAt: serverTimestamp()
        }
    );

    return callRef.id;

}

// Update call data
export async function updateCall(callId, data) {

    await updateDoc(
        doc(db, "calls", callId),
        data
    );

}

// Listen for changes
export function listenCall(callId, callback) {

    return onSnapshot(
        doc(db, "calls", callId),
        (snap) => {

            if (snap.exists()) {

                callback(snap.data());

            }

        }
    );

}