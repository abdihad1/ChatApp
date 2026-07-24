import { auth } from "./firebase.js";
import { getAllUsers } from "./users.js";
import { setCurrentChat } from "./currentChat.js";

import {
    collection,
    getDocs,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { db } from "./firebase.js";

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
            <img src="${user.photo || "https://ui-avatars.com/api/?name=User&background=00a884&color=fff"}"
     width="40"
     height="40"
     style="border-radius:50%;">
            <div>
    <strong>${user.name || "No Name"}</strong><br>
    <small>${user.email}</small>
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

    onSnapshot(collection(db, "users"), (snapshot) => {

        allUsers = [];

        snapshot.forEach((doc) => {

            allUsers.push({
                uid: doc.id,
                ...doc.data()
            });

        });

        displayUsers(allUsers);

    });

    displayGroups();

}

searchInput.addEventListener("input", () => {

    const text = searchInput.value.toLowerCase();

    const filtered = allUsers.filter(user =>

        (user.name || "").toLowerCase().includes(text) ||

        (user.email || "").toLowerCase().includes(text)

    );

    displayUsers(filtered);

});

loadUsers();

async function displayGroups() {

    const snapshot = await getDocs(collection(db, "groups"));

    snapshot.forEach(doc => {

        const group = doc.data();

        // Show only groups where current user is a member
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

document
.getElementById("settingsBtn")
.onclick = () => {

    window.location.href = "settings.html";

};