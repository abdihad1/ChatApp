import { supabase } from "./supabase.js";

export async function uploadVoice(audioBlob) {

    const fileName = `${Date.now()}.webm`;

    const { error } = await supabase.storage
        .from("voice-messages")
        .upload(fileName, audioBlob);

    if (error) {
        throw error;
    }

    const { data } = supabase.storage
        .from("voice-messages")
        .getPublicUrl(fileName);

    return data.publicUrl;
}