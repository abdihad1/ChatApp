import { supabase } from "./supabase.js";

export async function uploadImage(file) {

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
        .from("chat-images")
        .upload(fileName, file);

    if (error) {
        throw error;
    }

    const { data } = supabase.storage
        .from("chat-images")
        .getPublicUrl(fileName);

    return data.publicUrl;

}