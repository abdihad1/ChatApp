import { protectPage } from "./auth.js";
import { auth, db } from "./firebase.js";
import { getCurrentChat } from "./currentChat.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { setOnlineStatus } from "./users.js";
import { showToast } from "./toast.js";
import { initMessageSearch } from "./search.js";
import { createMessageElement } from "./messageRenderer.js";
import { supabase } from "./supabase.js";
import {
    openMessageMenu,
    closeMessageMenu,
    copyMessage,
    replyToMessage,
    editMessage,
    deleteMessage,
    reactToMessage
} from "./messageMenu.js";

import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    doc,
    updateDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

protectPage();

setOnlineStatus(true);

const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("message");
const searchInput = document.getElementById("searchMessage");
const messageMenu = document.getElementById("messageMenu");
const confirmModal = document.getElementById("confirmModal");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const cancelDeleteBtn = document.getElementById("cancelDelete");
const imageBtn = document.getElementById("imageBtn");
const imageInput = document.getElementById("imageInput");
let typingTimeout;

messageInput.addEventListener("input", async () => {

    const otherUser = getCurrentChat();

    if (!otherUser) return;

    const chatId = getChatId(
        auth.currentUser.uid,
        otherUser.uid
    );

    await updateDoc(
        doc(db, "chats", chatId),
        {
            typing: auth.currentUser.uid
        }
    );

    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(async () => {

        await updateDoc(
            doc(db, "chats", chatId),
            {
                typing: ""
            }
        );

    }, 1500);

});
messageInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        sendBtn.click();

    }

});
const messagesDiv = document.getElementById("messages");

let unsubscribe = null;
let replyingTo = null;
let selectedMessageId = null;
let selectedMessageText = null;

// Create the same chat ID for both users
function getChatId(uid1, uid2) {
    return [uid1, uid2].sort().join("_");
}

// Open a private chat
function openChat() {

    const otherUser = getCurrentChat();

    if (!otherUser) return;

    const chatId = getChatId(auth.currentUser.uid, otherUser.uid);

    // Stop listening to the previous chat
    if (unsubscribe) {
        unsubscribe();
    }

    const q = query(
        collection(db, "chats", chatId, "messages"),
        orderBy("createdAt")
    );

const chatRef = doc(db, "chats", chatId);

onSnapshot(chatRef, (snap) => {

    if (!snap.exists()) return;

    const data = snap.data();

    const typingStatus = document.getElementById("typingStatus");

    if (data.typing && data.typing !== auth.currentUser.uid) {

        typingStatus.textContent = "typing...";

    } else {

        typingStatus.textContent = "";

    }

});

    unsubscribe = onSnapshot(q, (snapshot) => {

        messagesDiv.innerHTML = "";

        snapshot.forEach(async (messageDoc) => {

    const data = messageDoc.data();

    if (
        data.uid !== auth.currentUser.uid &&
        !data.read
    ) {
        await updateDoc(
            doc(
                db,
                "chats",
                chatId,
                "messages",
                messageDoc.id
            ),
            {
                read: true
            }
        );
    }

});

        snapshot.forEach((messageDoc) => {

            const data = messageDoc.data();
            const messageId = messageDoc.id;

const div = createMessageElement({
    ...data,
    currentUserId: auth.currentUser.uid
});

            div.style.padding = "8px";
            div.style.margin = "5px";

            messagesDiv.appendChild(div);


if (data.uid === auth.currentUser.uid) {

div.addEventListener("contextmenu", (e) => {

    e.preventDefault();

    selectedMessageId = messageId;
    selectedMessageText = data.text;

    openMessageMenu(messageMenu, e.pageX, e.pageY);

});

}

         messagesDiv.scrollTop = messagesDiv.scrollHeight;

        });

    });

}

// Send message
sendBtn.onclick = async () => {

    const otherUser = getCurrentChat();

    if (!otherUser) {
        alert("Select a user first.");
        return;
    }

    const text = messageInput.value.trim();

    if (text === "") return;

    const chatId = getChatId(auth.currentUser.uid, otherUser.uid);

await addDoc(
    collection(db, "chats", chatId, "messages"),
    {
        uid: auth.currentUser.uid,
        name: auth.currentUser.displayName || auth.currentUser.email,
        text: text,
        replyTo: replyingTo,
        createdAt: serverTimestamp(),
        delivered: true,
        read: false
    }
);

// Create / update chat information
await updateDoc(
    doc(db, "chats", chatId),
    {
        users: [
            auth.currentUser.uid,
            otherUser.uid
        ],

        lastMessage: text,

        lastMessageTime: serverTimestamp()
    }
).catch(async () => {

    await setDoc(
        doc(db, "chats", chatId),
        {
            users: [
                auth.currentUser.uid,
                otherUser.uid
            ],

            lastMessage: text,

            lastMessageTime: serverTimestamp()
        }
    );

});

    messageInput.value = "";

  replyingTo = null;
messageInput.placeholder = "Type a message";

};

// Check every 500ms if the selected chat changed
setInterval(() => {

    const otherUser = getCurrentChat();

    if (!otherUser) return;

    const newChatId = getChatId(auth.currentUser.uid, otherUser.uid);

    if (window.currentChatId !== newChatId) {

        window.currentChatId = newChatId;

        openChat();

    }

}, 500);

        document.getElementById("logoutBtn").onclick = async () => {

    await signOut(auth);

    window.location.href = "login.html";

};

   window.addEventListener("beforeunload", async () => {
    await setOnlineStatus(false);
});

   const emojiBtn = document.getElementById("emojiBtn");

emojiBtn.onclick = () => {

    messageInput.value += "😊";

    messageInput.focus();

};

imageBtn.onclick = () => {
    imageInput.click();
};

imageInput.onchange = async () => {

    const file = imageInput.files[0];

    if (!file) return;

    console.log(file);

};

   const callBtn = document.getElementById("callBtn");

callBtn.onclick = async () => {

    try {

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        alert("🎤 Microphone access granted!");

        stream.getTracks().forEach(track => track.stop());

    } catch (err) {

        alert("Microphone permission denied.");

        console.error(err);

    }

};  

initMessageSearch(searchInput, messagesDiv);

document.addEventListener("click", (e) => {

    if (!messageMenu.contains(e.target)) {
        closeMessageMenu(messageMenu);
    }

});

const deleteBtn = document.getElementById("deleteMsg");

deleteBtn.onclick = () => {

    if (!selectedMessageId) return;

    confirmModal.style.display = "flex";
    closeMessageMenu(messageMenu);

};

confirmDeleteBtn.onclick = async () => {

    const otherUser = getCurrentChat();
    const chatId = getChatId(auth.currentUser.uid, otherUser.uid);

    await deleteMessage(
    db,
    chatId,
    selectedMessageId
);

    confirmModal.style.display = "none";

    showToast("🗑️ Message deleted");

};

cancelDeleteBtn.onclick = () => {

    confirmModal.style.display = "none";

};

const copyBtn = document.getElementById("copyMsg");

copyBtn.onclick = async () => {

    await copyMessage(selectedMessageText, showToast);

    closeMessageMenu(messageMenu);

};

const editBtn = document.getElementById("editMsg");

editBtn.onclick = async () => {

    if (!selectedMessageId) return;

    const otherUser = getCurrentChat();
    const chatId = getChatId(auth.currentUser.uid, otherUser.uid);

    await editMessage(
        db,
        chatId,
        selectedMessageId,
        selectedMessageText
    );

    closeMessageMenu(messageMenu);

};

const replyMenuBtn = document.getElementById("replyMsg");

replyMenuBtn.onclick = () => {

    replyingTo = replyToMessage(
        selectedMessageText,
        messageInput
    );

    closeMessageMenu(messageMenu);

};

const reactMenuBtn = document.getElementById("reactMsg");

reactMenuBtn.onclick = async () => {

    if (!selectedMessageId) return;

    const otherUser = getCurrentChat();
    const chatId = getChatId(auth.currentUser.uid, otherUser.uid);

    await reactToMessage(
        db,
        chatId,
        selectedMessageId
    );

    closeMessageMenu(messageMenu);

};