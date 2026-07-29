import { auth, db } from "./firebase.js";

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
const searchInput = document.getElementById("searchUser");

let allUsers = [];

function displayUsers(users) {

    userList.innerHTML = "";

    users.forEach(user => {

        if (auth.currentUser && user.uid === auth.currentUser.uid) return;

        const div = document.createElement("div");

        div.className = "user";

        div.innerHTML = `

<img src="${
user.photo ||
"https://ui-avatars.com/api/?name=User&background=00a884&color=fff"
}">

<div style="flex:1">

<strong>
${user.name || "No Name"}
</strong>

<br>

<small class="last-message">
${user.lastMessage || user.email}
</small>

</div>


<div>

<div style="font-size:12px;color:#667781;text-align:right">

${
user.lastMessageTime
?
new Date(
user.lastMessageTime.seconds * 1000
).toLocaleTimeString([],{
hour:"2-digit",
minute:"2-digit"
})
:
""
}

</div>


${
user.unread > 0
?
`
<div class="unread-badge">
${user.unread}
</div>
`
:
""
}


${
user.online
?
`
<span class="online-dot"></span>
`
:
""
}

</div>

`;

        div.onclick = () => {

            setCurrentChat(user);

          if (window.innerWidth <= 768) {

    document.querySelector(".sidebar").classList.add("hide");

    document.querySelector(".chat").classList.add("active");

}

            document.getElementById("chatName").textContent =
                user.name || user.email;

            if (user.online) {

    document.getElementById("chatStatus").textContent =
        "🟢 Online";

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

    document.getElementById("chatStatus").textContent = text;

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


});

}

            const data = chat.data();

            if (!data.users) continue;

            if (!data.users.includes(currentUid)) continue;

            const otherUid =
                data.users.find(uid => uid !== currentUid);

            const userSnap = await getDoc(
                doc(db,"users",otherUid)
            );

            if(!userSnap.exists()) continue;

        displayUsers(allUsers);

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

        div.className = "user";

        div.innerHTML = `
            <div style="font-size:40px">👥</div>

            <div>
                <strong>${group.name}</strong><br>
                <small>Group Chat</small>
            </div>
        `;

        div.onclick = () => {

            setCurrentChat({
    ...group,
    id: doc.id,
    type: "group"
});

document.getElementById("chatName").textContent =
    group.name;

document.getElementById("chatStatus").textContent =
    "👥 Group";

        };

        userList.appendChild(div);

    });

}

const settingsBtn = document.getElementById("settingsBtn");

if(settingsBtn){

    settingsBtn.onclick = () => {

        window.location.href = "settings.html";

    };

}