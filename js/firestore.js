// firestore.js

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

// ==========================
// Users
// ==========================

// Create user if it doesn't exist
export const createUser = async (user) => {
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
    });
  }
};

// Get all users
export const getUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// ==========================
// Chats
// ==========================

// Create a new chat
export const createChat = async (chatData) => {
  const docRef = await addDoc(collection(db, "chats"), {
    ...chatData,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

// ==========================
// Messages
// ==========================

// Send a message
export const sendMessage = async (chatId, message) => {
  await addDoc(collection(db, "chats", chatId, "messages"), {
    ...message,
    createdAt: serverTimestamp(),
  });
};

// Get messages query
export const getMessagesQuery = (chatId) => {
  return query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt", "asc")
  );
};