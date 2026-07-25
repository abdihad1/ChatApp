import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    doc,
    updateDoc,
    serverTimestamp,
    onSnapshot,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
    collection,
    addDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

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

export async function updateCall(callId, data) {

    await updateDoc(
        doc(db, "calls", callId),
        data
    );

}

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

export async function acceptCall(callId) {

    await updateCall(callId, {
        status: "accepted"
    });

}

export async function rejectCall(callId) {

    await updateCall(callId, {
        status: "rejected"
    });

}

export async function saveOffer(callId, offer) {

    await updateDoc(doc(db, "calls", callId), {
        offer
    });

}

export async function saveAnswer(callId, answer) {

    await updateDoc(doc(db, "calls", callId), {
        answer
    });

}

export async function getCall(callId) {

    return await getDoc(doc(db, "calls", callId));

}

export async function addCallerCandidate(callId, candidate) {

    await addDoc(
        collection(db, "calls", callId, "callerCandidates"),
        candidate.toJSON()
    );

}

export async function addReceiverCandidate(callId, candidate) {

    await addDoc(
        collection(db, "calls", callId, "receiverCandidates"),
        candidate.toJSON()
    );

}

export function listenCallerCandidates(callId, callback) {

    return onSnapshot(
        collection(db, "calls", callId, "callerCandidates"),
        (snapshot) => {

            snapshot.docChanges().forEach((change) => {

                if (change.type === "added") {

                    callback(change.doc.data());

                }

            });

        }
    );

}

export function listenReceiverCandidates(callId, callback) {

    return onSnapshot(
        collection(db, "calls", callId, "receiverCandidates"),
        (snapshot) => {

            snapshot.docChanges().forEach((change) => {

                if (change.type === "added") {

                    callback(change.doc.data());

                }

            });

        }
    );

}