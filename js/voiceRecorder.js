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

    audioChunks = [];

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {

        if (event.data.size > 0) {
            audioChunks.push(event.data);
        }

    };

    mediaRecorder.start();

}

export function stopRecording() {

    return new Promise((resolve) => {

        mediaRecorder.onstop = () => {

            const blob = new Blob(audioChunks, {
                type: "audio/webm"
            });

            mediaRecorder.stream
                .getTracks()
                .forEach(track => track.stop());

            resolve(blob);

        };

        mediaRecorder.stop();

    });

}