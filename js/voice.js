let mediaRecorder;
let audioChunks = [];

export async function startRecording() {

    const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
    });

    mediaRecorder = new MediaRecorder(stream);

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