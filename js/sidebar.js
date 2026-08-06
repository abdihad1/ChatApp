import { auth, db } from "./firebase.js";
import { openChat as openMobileChat } from "./mobile.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import { setCurrentChat } from "./currentChat.js";

import {
    collection,
    getDocs,
    onSnapshot,
    getDoc,
    doc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const userList = document.getElementById("userList");
const searchInput = document.getElementById("userSearch");

let allUsers = [];

function displayUsers(users) {

    userList.innerHTML = "";

    users.forEach(user => {

        if (auth.currentUser && user.uid === auth.currentUser.uid) return;

        const div = document.createElement("div");

    div.dataset.uid = user.uid;

        div.className = "user-card";

div.innerHTML = `

<div class="user-avatar-wrapper">

<img
class="user-avatar"
src="${
user.photo ||
"https://ui-avatars.com/api/?name=User"
}">

${
user.online
?
'<span class="online-dot"></span>'
:
''
}

</div>

<div class="user-content">

<div class="user-top">

<div class="user-name">

${user.name || "Unknown"}

</div>

<div class="user-time">

${
user.lastMessageTime
?
new Date(
user.lastMessageTime.seconds*1000
).toLocaleTimeString([],{
hour:"2-digit",
minute:"2-digit"
})
:
""
}

</div>

</div>

<div class="user-bottom">

<div class="user-last">

${user.lastMessage || "Start chatting"}

</div>

${
user.unread>0
?
`
<div class="badge">

${user.unread}

</div>
`
:
""
}

</div>

</div>

`;

        div.onclick = () => {

 // Remove active from other chats
   document
.querySelectorAll(".user-card")
    .forEach(item => {
        item.classList.remove("active");
    });


    // Add active to selected chat
    div.classList.add("active");


    // Save last opened chat
    localStorage.setItem(
        "chativo-last-chat",
        user.uid
    );


// Activate chat mode
document.body.classList.add("chat-selected");


// Hide welcome screen
const welcome = document.getElementById("welcomeScreen");

if (welcome) {

    welcome.classList.add("hidden");

}


// Show messages
const messages = document.getElementById("messages");

if (messages) {

    messages.style.display = "flex";

}


// Show message input
const composer = document.querySelector(".chat-composer");

if (composer) {

    composer.style.display = "flex";

}

            setCurrentChat(user);

   if(window.openChat){
    window.openChat();
}

             openMobileChat();

            document.getElementById("chatName").textContent =
                user.name || user.email;

            if (user.online) {

    document.getElementById("lastSeen").textContent =
    "Online";

} else {

    let text = "Offline";

    if (user.lastSeen) {

        const date = user.lastSeen.toDate();

        const now = new Date();

if (date.toDateString() === now.toDateString()) {

    text = "Last seen today at " +
        date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

} else {

    text = "Last seen " +
        date.toLocaleDateString() + " " +
        date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

}

    }

    document.getElementById("lastSeen").textContent = text;

}

            document.getElementById("chatPhoto").src =
    user.photo || "https://ui-avatars.com/api/?name=User&background=00a884&color=fff";

        };

        
        userList.appendChild(div);

    });

}

function loadUsers() {

onSnapshot(
collection(db,"chats"),
async(snapshot)=>{

allUsers=[];

for(const chat of snapshot.docs){

const data = chat.data();


if(!data.users) continue;


if(!data.users.includes(auth.currentUser.uid))
continue;



const otherUid =
data.users.find(
uid => uid !== auth.currentUser.uid
);


const userSnap =
await getDoc(
doc(db,"users",otherUid)
);


if(!userSnap.exists())
continue;


allUsers.push({

uid:otherUid,

...userSnap.data(),

lastMessage:
data.lastMessage || "Start chatting",

lastMessageTime:
data.lastMessageTime,

unread:
data.unread || 0

});


}


displayUsers(allUsers);
restoreLastChat();

});

}

searchInput.addEventListener("input", () => {

    const text = searchInput.value.toLowerCase();

    const filtered = allUsers.filter(user =>

        (user.name || "").toLowerCase().includes(text) ||

        (user.email || "").toLowerCase().includes(text)

    );

    displayUsers(filtered);

});

onAuthStateChanged(auth, (user) => {

    if (!user) return;

    loadUsers();

    displayGroups();

});

async function displayGroups() {

    const snapshot = await getDocs(collection(db, "groups"));

    snapshot.forEach(doc => {

        const group = doc.data();

        // Show only groups where current user is a member
        if (!auth.currentUser) return;

if (!group.members[auth.currentUser.uid]) return;

        const div = document.createElement("div");

        div.className = "user-card";

        div.innerHTML = `

<div class="user-avatar-wrapper">

<div class="user-avatar group-avatar">
👥
</div>

</div>


<div class="user-info">

<div class="user-name">

${group.name}

</div>


<div class="user-last">

Group Chat

</div>

</div>

`;
        userList.appendChild(div);

    });

}

const settingsBtn = document.getElementById("settingsBtn");

if(settingsBtn){

    settingsBtn.onclick = () => {

        window.location.href = "settings.html";

    };

}

function restoreLastChat() {

    const last = localStorage.getItem("chativo-last-chat");

    if (!last) return;

    setTimeout(() => {

        const card = document.querySelector(
            `.user-card[data-uid="${last}"]`
        );

        if (card) {

            card.click();

        }

    }, 300);

}