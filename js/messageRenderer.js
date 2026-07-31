export function createMessageElement(data) {

    const div = document.createElement("div");

    div.className =
        data.uid === data.currentUserId
            ? "me"
            : "other";

    const time = data.createdAt
        ? new Date(data.createdAt.seconds * 1000)
              .toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
              })
        : "";

    const tick = data.read ? "✓✓" : "✓";

    div.innerHTML = `
        ${data.type === "group" ? `<b class="sender-name">${data.name}</b>` : ""}

        ${data.replyTo ? `
    <div class="reply-box">
        ↩ ${data.replyTo}
    </div>
` : ""}

${
    data.image
        ? `
            <a href="${data.image}" target="_blank">
                <img
                    src="${data.image}"
                    class="chat-image"
                    alt="Shared image">
            </a>
        `
        : data.voice
            ? `
                <audio controls class="voice-message">
                    <source src="${data.voice}" type="audio/webm">
                    Your browser does not support audio.
                </audio>
            `
            : data.text
}

        ${data.reaction ? `
    <div class="message-reaction">
        ${data.reaction}
    </div>
` : ""}

        ${data.edited ? '<small class="edited">(edited)</small>' : ""}
        <br>

        <small class="message-time">
            ${time} ${tick}
        </small>
    `;

    return div;

}