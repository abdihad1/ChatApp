let mediaRecorder;
let audioChunks = [];

export async function startRecording() {

const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1
    }
});

mediaRecorder = new MediaRecorder(stream, {
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