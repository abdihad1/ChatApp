import { auth } from "./firebase.js";
import { getCurrentChat } from "./currentChat.js";
import { createCall } from "./signaling.js";

import {
    createPeer,
    startMicrophone,
    getPeer,
    closePeer
} from "./webrtc.js";

import {
    saveOffer,
    listenCall,
    addCallerCandidate,
    listenReceiverCandidates
} from "./signaling.js";

export let currentCallId = null;

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

        currentCallId = await createCall(
    auth.currentUser.uid,
    chat.uid
);

await createPeer();

await startMicrophone();

const peer = getPeer();

peer.onicecandidate = async (event) => {

    if (event.candidate) {

        await addCallerCandidate(
            currentCallId,
            event.candidate
        );

    }

};

listenReceiverCandidates(currentCallId, async (candidate) => {

    await peer.addIceCandidate(
        new RTCIceCandidate(candidate)
    );

});

const offer = await peer.createOffer();

await peer.setLocalDescription(offer);

document.getElementById("callScreen").style.display = "block";
document.getElementById("callTitle").textContent = "Calling...";

listenCall(currentCallId, async (call) => {

    if (call.answer && !peer.currentRemoteDescription) {

        await peer.setRemoteDescription(
            new RTCSessionDescription(call.answer)
        );

        console.log("Voice connection established.");

    }

    if (call.status === "ended") {

        closePeer();

        document.getElementById("callScreen").style.display = "none";

        alert("Call ended.");

    }

});

console.log("Offer sent.");
    } catch (err) {

        console.error(err);

        alert("Failed to start call.");

    }

});