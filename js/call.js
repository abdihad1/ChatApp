import { auth } from "./firebase.js";
import { getCurrentChat } from "./currentChat.js";
import { createCall } from "./signaling.js";

const callBtn = document.getElementById("callBtn");

callBtn.addEventListener("click", async () => {

    const chat = getCurrentChat();

    if (!chat) {

        alert("Select a user first.");
        return;

    }

    if (!auth.currentUser) {

        alert("You are not logged in.");
        return;

    }

    try {

        const callId = await createCall(

            auth.currentUser.uid,
            chat.uid

        );

        console.log("Call created:", callId);

        alert("Calling " + (chat.name || chat.email));

    } catch (err) {

        console.error(err);

        alert("Failed to start call.");

    }

});