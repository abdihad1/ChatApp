let peerConnection = null;
let localStream = null;

const configuration = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        }
    ]
};

export async function createPeerConnection() {

    peerConnection = new RTCPeerConnection(configuration);

    localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
    });

    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    return peerConnection;

}

export function getPeerConnection() {
    return peerConnection;
}

export function getLocalStream() {
    return localStream;
}

export function closeConnection() {

    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }

    if (localStream) {

        localStream.getTracks().forEach(track => track.stop());

        localStream = null;

    }

}