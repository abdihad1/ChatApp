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
            video: false

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