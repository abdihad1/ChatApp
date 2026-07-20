import { protectPage } from "./auth.js";
import { auth, db } from "./firebase.js";
import { getCurrentChat } from "./currentChat.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { setOnlineStatus } from "./users.js";

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
    deleteDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

protectPage();

setOnlineStatus(true);

const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("message");
const searchInput = document.getElementById("searchMessage");
const messageMenu = document.getElementById("messageMenu");
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

            const div = document.createElement("div");

      if (data.uid === auth.currentUser.uid) {
    div.className = "me";
} else {
    div.className = "other";
}

            div.style.padding = "8px";
            div.style.margin = "5px";

            const time = data.createdAt
    ? new Date(data.createdAt.seconds * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
      })
    : "";

const tick = data.read ? "✓✓" : "✓";

div.innerHTML = `
    <b>${data.name}</b><br>

    ${data.replyTo ? `
        <div style="
            border-left:3px solid #25D366;
            padding-left:8px;
            margin:5px 0;
            color:gray;
            font-size:14px;">
            ↩ ${data.replyTo}
        </div>
    ` : ""}

    ${data.text}

    ${data.reaction ? `
    <div style="margin-top:5px;font-size:20px;">
        ${data.reaction}
    </div>
` : ""}

    ${data.edited ? "<small>(edited)</small>" : ""}
    <br>
    <small class="message-time">
        ${time} ${tick}
    </small>
`;

            messagesDiv.appendChild(div);


if (data.uid === auth.currentUser.uid) {

div.addEventListener("contextmenu", (e) => {

    e.preventDefault();

    selectedMessageId = messageId;
    selectedMessageText = data.text;

    messageMenu.style.display = "block";
    messageMenu.style.left = e.pageX + "px";
    messageMenu.style.top = e.pageY + "px";
    messageMenu.style.zIndex = "9999";

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

searchInput.addEventListener("input", () => {

    const search = searchInput.value.toLowerCase();

    const messages = messagesDiv.querySelectorAll("div");

    messages.forEach((msg) => {

        if (msg.textContent.toLowerCase().includes(search)) {
            msg.style.display = "";
        } else {
            msg.style.display = "none";
        }

    });

});

document.addEventListener("click", (e) => {

    if (!messageMenu.contains(e.target)) {
        messageMenu.style.display = "none";
    }

});

const deleteBtn = document.getElementById("deleteMsg");

deleteBtn.onclick = async () => {

    if (!selectedMessageId) return;

    const otherUser = getCurrentChat();
    const chatId = getChatId(auth.currentUser.uid, otherUser.uid);

    await deleteDoc(
        doc(db, "chats", chatId, "messages", selectedMessageId)
    );

    messageMenu.style.display = "none";
};

const copyBtn = document.getElementById("copyMsg");

copyBtn.onclick = async () => {

    if (!selectedMessageText) return;

    await navigator.clipboard.writeText(selectedMessageText);

    messageMenu.style.display = "none";

    alert("Message copied!");
};

const editBtn = document.getElementById("editMsg");

editBtn.onclick = async () => {

    if (!selectedMessageId) return;

    const newText = prompt("Edit message:", selectedMessageText);

    if (!newText) return;

    const otherUser = getCurrentChat();
    const chatId = getChatId(auth.currentUser.uid, otherUser.uid);

    await updateDoc(
        doc(db, "chats", chatId, "messages", selectedMessageId),
        {
            text: newText.trim(),
            edited: true
        }
    );

    messageMenu.style.display = "none";
};

const replyMenuBtn = document.getElementById("replyMsg");

replyMenuBtn.onclick = () => {

    if (!selectedMessageText) return;

    replyingTo = selectedMessageText;

    messageInput.focus();
    messageInput.placeholder = "Replying to: " + selectedMessageText;

    messageMenu.style.display = "none";
};

const reactMenuBtn = document.getElementById("reactMsg");

reactMenuBtn.onclick = async () => {

    if (!selectedMessageId) return;

    const emoji = prompt("React with:\n👍 ❤️ 😂 😮 😢 🙏");

    if (!emoji) return;

    const otherUser = getCurrentChat();
    const chatId = getChatId(auth.currentUser.uid, otherUser.uid);

    await updateDoc(
        doc(db, "chats", chatId, "messages", selectedMessageId),
        {
            reaction: emoji
        }
    );

    messageMenu.style.display = "none";
};