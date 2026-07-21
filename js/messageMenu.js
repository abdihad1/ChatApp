export function openMessageMenu(messageMenu, x, y) {
    messageMenu.style.display = "block";
    messageMenu.style.left = x + "px";
    messageMenu.style.top = y + "px";
    messageMenu.style.zIndex = "9999";
}

export function closeMessageMenu(messageMenu) {
    messageMenu.style.display = "none";
}

export async function copyMessage(text, showToast) {

    if (!text) return;

    await navigator.clipboard.writeText(text);

    showToast("✅ Message copied");

}

export function replyToMessage(text, messageInput) {

    if (!text) return;

    messageInput.focus();
    messageInput.placeholder = "Replying to: " + text;

    return text;

}

import {
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

export async function editMessage(db, chatId, messageId, oldText) {

    const newText = prompt("Edit message:", oldText);

    if (!newText) return;

    await updateDoc(
        doc(db, "chats", chatId, "messages", messageId),
        {
            text: newText.trim(),
            edited: true
        }
    );

}

export async function deleteMessage(db, chatId, messageId) {

    await deleteDoc(
        doc(db, "chats", chatId, "messages", messageId)
    );

}

export async function reactToMessage(db, chatId, messageId) {

    const emoji = prompt("React with:\n👍 ❤️ 😂 😮 😢 🙏");

    if (!emoji) return;

    await updateDoc(
        doc(db, "chats", chatId, "messages", messageId),
        {
            reaction: emoji
        }
    );

}