import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
 apiKey: "AIzaSyBhm6xKLWRsNXGyWW9IW610vchCd5TC3mw",
  authDomain: "chatapp-b85e6.firebaseapp.com",
  projectId: "chatapp-b85e6",
  storageBucket: "chatapp-b85e6.firebasestorage.app",
  messagingSenderId: "21694923759",
  appId: "1:21694923759:web:9177ef5c8f7e120f096c1a",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export {
    auth,
    db,
    provider
};