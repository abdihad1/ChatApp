import { auth } from "./firebase.js";
import { getCurrentChat } from "./currentChat.js";
import { createCall } from "./signaling.js";

import {
    createPeer,
    startMicrophone,
    getPeer
} from "./webrtc.js";

import {
    saveOffer,
    listenCall,
    addCallerCandidate,
    listenReceiverCandidates
} from "./signaling.js";

const callBtn = document.getElementById("callBtn");

callBtn.addEventListener("click", async () => {

    const chat = getCurrentChat();

    if (!chat) {

        alert("Select a user first.");
        return;

    }

    if (!auth.currentUser) {

        alert("You are not logged in.");
        return;

    }

    try {

        const callId = await createCall(
    auth.currentUser.uid,
    chat.uid
);

await createPeer();

await startMicrophone();

const peer = getPeer();

peer.onicecandidate = async (event) => {

    if (event.candidate) {

        await addCallerCandidate(
            callId,
            event.candidate
        );

    }

};

listenReceiverCandidates(callId, async (candidate) => {

    await peer.addIceCandidate(
        new RTCIceCandidate(candidate)
    );

});

const offer = await peer.createOffer();

await peer.setLocalDescription(offer);

await saveOffer(callId, offer);

listenCall(callId, async (call) => {

    if (call.answer && !peer.currentRemoteDescription) {

        await peer.setRemoteDescription(
            new RTCSessionDescription(call.answer)
        );

        console.log("Voice connection established.");

    }

});

console.log("Offer sent.");
    } catch (err) {

        console.error(err);

        alert("Failed to start call.");

    }

});