let localStream = null;
let peerConnection = null;

const servers = {
    iceServers: [
        {
            urls: [
                "stun:stun.l.google.com:19302",
                "stun:stun1.l.google.com:19302"
            ]
        }
    ]
};

export async function getLocalStream() {

    if (localStream) return localStream;

    localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
    });

    return localStream;
}

export function createPeerConnection() {

    peerConnection = new RTCPeerConnection(servers);

    return peerConnection;
}

export function getPeerConnection() {
    return peerConnection;
}

export function getStream() {
    return localStream;
}