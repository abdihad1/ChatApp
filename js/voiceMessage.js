import { uploadVoice } from "./voiceUpload.js";
import { startRecording, stopRecording } from "./voiceRecorder.js";

let recording = false;

export async function handleVoiceRecording(voiceBtn) {

    if (!recording) {

        await startRecording();

        recording = true;

        voiceBtn.textContent = "⏹️";

        return null;

    }

    const audioBlob = await stopRecording();

    recording = false;

    voiceBtn.textContent = "🎤";

    const voiceUrl = await uploadVoice(audioBlob);

    return voiceUrl;

}