import { endCall } from "./signaling.js";
import { currentCallId as callerCallId } from "./call.js";
import { currentCallId as receiverCallId } from "./incomingCall.js";

import {
    closePeer,
    toggleMute,
    toggleCamera
} from "./webrtc.js";

const callScreen = document.getElementById("callScreen");
const endBtn = document.getElementById("endCallBtn");
const muteBtn = document.getElementById("muteBtn");
const cameraBtn = document.getElementById("cameraBtn");

endBtn.addEventListener("click", async () => {

    const id = callerCallId || receiverCallId;

    if (id) {
        await endCall(id);
    }

    closePeer();

    callScreen.style.display = "none";

});

muteBtn.addEventListener("click", () => {

    const micEnabled = toggleMute();

    muteBtn.textContent =
        micEnabled ? "🎤 Mute" : "🔇 Unmute";

});

cameraBtn.addEventListener("click", () => {

    const cameraEnabled = toggleCamera();

    cameraBtn.textContent =
        cameraEnabled ? "📷 Camera" : "🚫 Camera";

});