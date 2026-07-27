import {
    closePeer,
    toggleMute,
    toggleCamera
} from "./webrtc.js";

const callScreen = document.getElementById("callScreen");

document.getElementById("endCallBtn").onclick = () => {
    closePeer();
    callScreen.style.display = "none";
};

document.getElementById("muteBtn").onclick = () => {
    const enabled = toggleMute();
    document.getElementById("muteBtn").textContent =
        enabled ? "🎤 Mute" : "🔇 Unmute";
};

document.getElementById("cameraBtn").onclick = () => {
    const enabled = toggleCamera();
    document.getElementById("cameraBtn").textContent =
        enabled ? "📷 Camera" : "🚫 Camera";
};