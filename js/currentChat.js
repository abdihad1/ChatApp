let currentChat = null;

export function setCurrentChat(chat) {
    currentChat = chat;
}

export function getCurrentChat() {
    return currentChat;
}

export function hasCurrentChat() {
    return currentChat !== null;
}