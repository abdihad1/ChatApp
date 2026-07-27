import { auth, db } from "./firebase.js";
import {
    acceptCall,
    rejectCall
} from "./signaling.js";

import {
    collection,
    onSnapshot,
    query,
    where
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
    createPeer,
    startMicrophone,
    getPeer,
    closePeer
} from "./webrtc.js";

import {
    saveAnswer,
    getCall,
    addReceiverCandidate,
    listenCallerCandidates,
    listenCall
} from "./signaling.js";

const popup = document.getElementById("incomingCallModal");
const callerName = document.getElementById("incomingCallerName");
const callerPhoto = document.getElementById("incomingCallerPhoto");
const acceptBtn = document.getElementById("acceptCallBtn");
const rejectBtn = document.getElementById("rejectCallBtn");

export let currentCallId = null;

let unsubscribe = null;

auth.onAuthStateChanged((user) => {

    if (!user) return;

    if (unsubscribe) unsubscribe();

    const q = query(
        collection(db, "calls"),
        where("receiver", "==", user.uid),
        where("status", "==", "calling")
    );

    unsubscribe = onSnapshot(q, (snapshot) => {

        snapshot.docChanges().forEach((change) => {

            if (change.type !== "added") return;

            const call = change.doc.data();
 
            window.currentIncomingCall = call;

            currentCallId = change.doc.id;

           callerName.textContent = "Incoming Call";
callerPhoto.src =
    "https://ui-avatars.com/api/?name=Caller&background=00a884&color=fff";

popup.style.display = "flex";            

            console.log("Incoming call:", call);

        });

    });

});

acceptBtn.onclick = async () => {

    if (!currentCallId) return;

    await acceptCall(currentCallId);

    await createPeer();

    await startMicrophone();

    const peer = getPeer();

peer.onicecandidate = async (event) => {

    if (event.candidate) {

        await addReceiverCandidate(
            currentCallId,
            event.candidate
        );

    }

};

listenCallerCandidates(currentCallId, async (candidate) => {

    await peer.addIceCandidate(
        new RTCIceCandidate(candidate)
    );

});

let callData = null;

for (let i = 0; i < 10; i++) {

    const latestCall = await getCall(currentCallId);

    callData = latestCall.data();

    if (callData.offer) break;

    await new Promise(resolve => setTimeout(resolve, 300));

}

if (!callData || !callData.offer) {

    alert("Failed to receive call offer.");

    return;

}

await peer.setRemoteDescription(
    new RTCSessionDescription(callData.offer)
);

    const answer = await peer.createAnswer();

    await peer.setLocalDescription(answer);

    await saveAnswer(currentCallId, answer);

    listenCall(currentCallId, (call) => {

    if (call.status === "ended") {

        closePeer();

        document.getElementById("callScreen").style.display = "none";

        alert("Call ended.");

    }

});

    document.getElementById("incomingCallModal").style.display = "none";

    document.getElementById("callScreen").style.display = "block";

    document.getElementById("callTitle").textContent = "Connecting...";

    console.log("Answer sent.");

};

rejectBtn.onclick = async () => {

    if (!currentCallId) return;

    await rejectCall(currentCallId);

    document.getElementById("incomingCallModal").style.display = "none";

};