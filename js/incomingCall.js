import { auth, db } from "./firebase.js";

import {
    collection,
    onSnapshot,
    query,
    where
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const popup = document.getElementById("callScreen");
const title = document.getElementById("callTitle");

let unsubscribe = null;

auth.onAuthStateChanged((user) => {

    if (!user) return;

    if (unsubscribe) unsubscribe();

    const q = query(
        collection(db, "calls"),
        where("receiver", "==", user.uid),
        where("status", "==", "calling")
    );

    unsubscribe = onSnapshot(q, (snapshot) => {

        snapshot.docChanges().forEach((change) => {

            if (change.type !== "added") return;

            const call = change.doc.data();

            title.textContent = "📞 Incoming Call";

            popup.style.display = "block";

            console.log("Incoming call:", call);

        });

    });

});