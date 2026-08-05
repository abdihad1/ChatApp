import { protectPage } from "./auth.js";
import { auth, db } from "./firebase.js";
import { getCurrentChat } from "./currentChat.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { setOnlineStatus } from "./users.js";
import { showToast } from "./toast.js";
import { initMessageSearch } from "./search.js";
import { createMessageElement } from "./messageRenderer.js";
import { supabase } from "./supabase.js";
import { uploadVoice } from "./voiceUpload.js";
import { registerNotifications } from "./notifications.js";
import { uploadImage } from "./imageUpload.js";
import { handleVoiceRecording } from "./voiceMessage.js";
import {
    startRecording,
    stopRecording
} from "./voice.js";

import {
    getChatId
} from "./chat/chatUtils.js";

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
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

protectPage();

if ("serviceWorker" in navigator) {

    navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => {

            console.log("✅ Service Worker registered");

        })
        .catch(console.error);

}

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
const voiceBtn = document.getElementById("voiceBtn");
const replyPreview = document.getElementById("replyPreview");
const replyPreviewText = document.getElementById("replyPreviewText");
const cancelReplyBtn = document.getElementById("cancelReplyBtn");
const backBtn = document.getElementById("backBtn");
let typingTimeout;

messageInput.addEventListener("input", () => {

    messageInput.style.height = "auto";

    messageInput.style.height =
        Math.min(messageInput.scrollHeight, 140) + "px";

});

function updateComposerButtons() {

    if (messageInput.value.trim() === "") {

        voiceBtn.style.display = "flex";
        sendBtn.style.display = "none";

    } else {

        voiceBtn.style.display = "none";
        sendBtn.style.display = "flex";

    }

}

messageInput.addEventListener("input", updateComposerButtons);

updateComposerButtons();

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
messageInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

        e.preventDefault();

        sendBtn.click();

    }

});

const messagesDiv = document.getElementById("messages");

const scrollBottomBtn =
document.getElementById("scrollBottomBtn");

const welcomeScreen =
document.getElementById("welcomeScreen");

const composer =
document.querySelector(".chat-composer");

const messages =
document.getElementById("messages");

// Auto Grow Textarea

messageInput.addEventListener("input", () => {

    messageInput.style.height = "48px";

    messageInput.style.height = messageInput.scrollHeight + "px";

    if (messageInput.scrollHeight > 140) {

        messageInput.style.overflowY = "auto";

    } else {

        messageInput.style.overflowY = "hidden";

    }

});

if(welcomeScreen)
welcomeScreen.style.display="flex";

if(messages)
messages.style.display="none";

if(composer)
composer.style.display="none";

let unsubscribe = null;
let replyingTo = null;
let selectedMessageId = null;
let selectedMessageText = null;

// Open a private chat
function openChat() {
  
window.openChat = openChat;

    const otherUser = getCurrentChat();

    if (!otherUser) return;

// Hide welcome screen
const welcome = document.getElementById("welcomeScreen");
if (welcome) welcome.style.display = "none";

// Show chat area
messagesDiv.style.display = "flex";

const composer = document.querySelector(".chat-composer");
if (composer) composer.style.display = "flex";

const onlineDot = document.getElementById("onlineDot");
const lastSeen = document.getElementById("lastSeen");

if (!onlineDot || !lastSeen) {
    console.error("onlineDot or lastSeen not found");
    return;
}

onSnapshot(doc(db, "users", otherUser.uid), (snap) => {

    if (!snap.exists()) return;

    const user = snap.data();

    if (user.online) {

        onlineDot.style.display = "block";
        lastSeen.textContent = "Online";

    } else {

        onlineDot.style.display = "none";

        if (user.lastSeen) {

            const date = user.lastSeen.toDate();

            lastSeen.textContent =
                "Last seen " +
                date.toLocaleString([], {
                    dateStyle: "short",
                    timeStyle: "short"
                });

        } else {

            lastSeen.textContent = "Offline";

        }

    }

});

    const chatId = getChatId(auth.currentUser.uid, otherUser.uid);

    // Stop listening to the previous chat
    if (unsubscribe) {
        unsubscribe();
    }

window.openChat = openChat;

    const q = query(
        collection(db, "chats", chatId, "messages"),
        orderBy("createdAt")
    );

const chatRef = doc(db, "chats", chatId);

onSnapshot(chatRef, (snap) => {

    if (!snap.exists()) return;

    const data = snap.data();

    const typingStatus = document.getElementById("typingStatus");

   if (
    data.typing &&
    data.typing !== auth.currentUser.uid
) {

    typingStatus.innerHTML =
        "<span class='typing-live'>Typing...</span>";

    document.getElementById("typingAnimation").style.display = "flex";

    typingStatus.classList.add("typing-active");

} else {

    typingStatus.innerHTML = "";

    document.getElementById("typingAnimation").style.display = "none";

    typingStatus.classList.remove("typing-active");

  }

 }); 

    unsubscribe = onSnapshot(q, (snapshot) => {

        messagesDiv.innerHTML = "";

        messagesDiv.classList.add("loading-chat");

  const welcome = document.getElementById("welcomeScreen");
if (welcome) welcome.style.display = "none";

messagesDiv.style.display = "flex";

document.querySelector(".chat-composer").style.display = "flex";

if (snapshot.empty) {

    messagesDiv.innerHTML = `
        <div class="empty-chat">
            <i class="fa-solid fa-comments"></i>
            <h2>No messages yet</h2>
            <p>Start the conversation.</p>
        </div>
    `;

    return;
}

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

        let lastDate = "";

snapshot.forEach((messageDoc) => {

    const data = messageDoc.data();
    const messageId = messageDoc.id;

    if (data.createdAt) {

        const date = data.createdAt.toDate();

        const currentDate = date.toDateString();

        if (currentDate !== lastDate) {

            lastDate = currentDate;

            const divider = document.createElement("div");

            divider.className = "date-divider";

            divider.textContent =
                new Intl.DateTimeFormat([], {
                    dateStyle: "full"
                }).format(date);

            messagesDiv.appendChild(divider);
        }
    }  

const div = createMessageElement({
    ...data,
    currentUserId: auth.currentUser.uid
});

if (
    data.uid === auth.currentUser.uid &&
    data.read
) {

    div.classList.add("seen-animation");

}


            div.classList.add("message");

messagesDiv.appendChild(div);

if (data.uid === auth.currentUser.uid) {

div.addEventListener("contextmenu", (e) => {

    e.preventDefault();

    selectedMessageId = messageId;
    selectedMessageText = data.text;

    openMessageMenu(messageMenu, e.pageX, e.pageY);

});

}

         setTimeout(()=>{

    messagesDiv.scrollTo({

        top:messagesDiv.scrollHeight,

        behavior:"smooth"

    });

setTimeout(() => {
    messagesDiv.classList.remove("loading-chat");
}, 300);


},100);

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

const userSnap = await getDoc(
    doc(db, "users", auth.currentUser.uid)
);

const currentUser = userSnap.data();

const messageRef = await addDoc(
    collection(db, "chats", chatId, "messages"),
    {
        uid: auth.currentUser.uid,
        name: currentUser.name,
        photo: currentUser.photo || "",
        text: text,
        replyTo: replyingTo,
        createdAt: serverTimestamp(),
        delivered: true,
        read: false
    }
);

messageInput.value = "";

messageInput.style.height = "48px";

// Send push notification

const recipientSnap = await getDoc(
    doc(db, "users", otherUser.uid)
);

if (recipientSnap.exists()) {

    const recipientData = recipientSnap.data();

    if (recipientData.fcmToken) {

        await fetch("/api/send-notification", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                token: recipientData.fcmToken,

                title: auth.currentUser.displayName || "New message",

                body: text

            })

        });

    }

}

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

messagesDiv.scrollTo({

top:messagesDiv.scrollHeight,

behavior:"smooth"

});

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

const picker =
document.getElementById("emojiPicker");


picker.classList.toggle("active");

};

document
.querySelectorAll("#emojiPicker span")
.forEach(emoji=>{


emoji.onclick=()=>{


messageInput.value += emoji.textContent;


messageInput.focus();


};


});

imageBtn.onclick = () => {
    imageInput.click();
};

imageInput.onchange = async () => {

    const file = imageInput.files[0];

    if (!file) return;

const imageUrl = await uploadImage(file);

const otherUser = getCurrentChat();

if (!otherUser) {
    alert("Select a user first.");
    return;
}

const chatId = getChatId(
    auth.currentUser.uid,
    otherUser.uid
);

await addDoc(
    collection(db, "chats", chatId, "messages"),
    {
        uid: auth.currentUser.uid,
        name: auth.currentUser.displayName || auth.currentUser.email,
        image: imageUrl,
        text: "",
        createdAt: serverTimestamp(),
        delivered: true,
        read: false
    }
);

await updateDoc(
doc(db,"chats",chatId),
{
lastMessage:"📷 Image",
lastMessageTime:serverTimestamp()
}
);

console.log(imageUrl);

imageInput.value = "";

};

   const callBtn = document.getElementById("callBtn");

callBtn.onclick = async () => {

    try {

        const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
    }
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

    replyingTo = selectedMessageText;

replyPreview.style.display = "flex";
replyPreviewText.textContent = selectedMessageText;

messageInput.focus();

cancelReplyBtn.onclick = () => {

    replyingTo = null;

    replyPreview.style.display = "none";

};

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

voiceBtn.onclick = async () => {

    const voiceUrl = await handleVoiceRecording(voiceBtn);

    if (!voiceUrl) return;

    const otherUser = getCurrentChat();

    if (!otherUser) {

        alert("Select a user first.");

        return;

    }

    const chatId = getChatId(
        auth.currentUser.uid,
        otherUser.uid
    );

    await addDoc(
        collection(db, "chats", chatId, "messages"),
        {
            uid: auth.currentUser.uid,
            name: auth.currentUser.displayName || auth.currentUser.email,
            voice: voiceUrl,
            text: "",
            createdAt: serverTimestamp(),
            delivered: true,
            read: false
        }
    );

await updateDoc(
doc(db,"chats",chatId),
{
lastMessage:"🎤 Voice message",
lastMessageTime:serverTimestamp()
}
);

    showToast("🎤 Voice message sent");

};

backBtn.onclick = () => {

    document.querySelector(".chat").classList.remove("active");

    document.querySelector(".sidebar").classList.remove("hide");

};

window.addEventListener("load", () => {
    const loading = document.getElementById("loadingScreen");

    if (loading) {
        loading.style.opacity = "0";

        setTimeout(() => {
            loading.style.display = "none";
        }, 300);
    }
});

const settingsBtn = document.getElementById("settingsBtn");

if (settingsBtn) {

    settingsBtn.addEventListener(
        "click",
        async () => {

            await registerNotifications();

        }
    );

}

const chatMenuBtn = document.getElementById("chatMenuBtn");
const chatMenu = document.getElementById("chatMenu");

if (chatMenuBtn && chatMenu) {

    chatMenuBtn.onclick = (e) => {

        e.stopPropagation();

        chatMenu.classList.toggle("active");

    };

    document.addEventListener("click", () => {

        chatMenu.classList.remove("active");

    });

    chatMenu.addEventListener("click", (e) => {

        e.stopPropagation();

    });

}

messagesDiv.addEventListener("scroll",()=>{

const distance =
messagesDiv.scrollHeight -
messagesDiv.scrollTop -
messagesDiv.clientHeight;

scrollBottomBtn.style.display =
distance>400 ? "flex":"none";

});

scrollBottomBtn.onclick=()=>{

messagesDiv.scrollTo({

top:messagesDiv.scrollHeight,

behavior:"smooth"

});

};