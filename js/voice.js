let mediaRecorder;
let audioChunks = [];

export async function startRecording() {

const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
    }
});

const audioContext = new AudioContext();

const source = audioContext.createMediaStreamSource(stream);

const gainNode = audioContext.createGain();

// Increase microphone volume
gainNode.gain.value = 2.5;

const destination = audioContext.createMediaStreamDestination();

source.connect(gainNode);
gainNode.connect(destination);

mediaRecorder = new MediaRecorder(destination.stream, {
    audioBitsPerSecond: 128000
});

    audioChunks = [];

    mediaRecorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
    };

    mediaRecorder.start();
}

export function stopRecording() {

    return new Promise((resolve) => {

        mediaRecorder.onstop = () => {

            const audioBlob = new Blob(audioChunks, {
                type: "audio/webm"
            });

            resolve(audioBlob);

        };

        mediaRecorder.stop();

    });

}