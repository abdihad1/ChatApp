import { supabase } from "./supabase.js";

export async function uploadProfileImage(file, uid) {

    if (!file) return null;

    const fileName = `${uid}-${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
        .from("profile-images")
        .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
        .from("profile-images")
        .getPublicUrl(fileName);

    return data.publicUrl;

}