let localStream = null;
let remoteStream = null;
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

export async function createPeer() {

    peerConnection = new RTCPeerConnection(servers);

    remoteStream = new MediaStream();

    document
        .getElementById("remoteVideo")
        .srcObject = remoteStream;

    peerConnection.ontrack = (event) => {

        event.streams[0]
            .getTracks()
            .forEach(track => {

                remoteStream.addTrack(track);

            });

    };

    return peerConnection;

}

export async function startMicrophone() {

    localStream =
        await navigator.mediaDevices.getUserMedia({

            audio: true,
            video: true

        });

    document
        .getElementById("localVideo")
        .srcObject = localStream;

    localStream
        .getTracks()
        .forEach(track => {

            peerConnection.addTrack(
                track,
                localStream
            );

        });

    return localStream;

}

export function getPeer() {
    return peerConnection;
}

export function getLocalStream() {
    return localStream;
}

export function closePeer() {

    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }

    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }

    if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop());
        remoteStream = null;
    }

    document.getElementById("localVideo").srcObject = null;
    document.getElementById("remoteVideo").srcObject = null;

}

export function toggleMute() {

    if (!localStream) return false;

    const audioTrack = localStream.getAudioTracks()[0];

    audioTrack.enabled = !audioTrack.enabled;

    return audioTrack.enabled;

}

export function toggleCamera() {

    if (!localStream) return false;

    const videoTrack = localStream.getVideoTracks()[0];

    if (!videoTrack) return false;

    videoTrack.enabled = !videoTrack.enabled;

    return videoTrack.enabled;

}