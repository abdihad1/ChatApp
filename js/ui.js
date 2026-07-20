export function scrollMessagesToBottom(messagesDiv) {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

export function clearMessages(messagesDiv) {
    messagesDiv.innerHTML = "";
}

export function setTypingStatus(text) {
    document.getElementById("typingStatus").textContent = text;
}

export function setChatHeader(user) {
    document.getElementById("chatName").textContent =
        user.name || user.email;

    document.getElementById("chatPhoto").src =
        user.photo ||
        "https://ui-avatars.com/api/?name=User&background=00a884&color=fff";
}