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
        <b>${data.name}</b><br>

        ${data.replyTo ? `
            <div style="
                border-left:3px solid #25D366;
                padding-left:8px;
                margin:5px 0;
                color:gray;
                font-size:14px;">
                ↩ ${data.replyTo}
            </div>
        ` : ""}

${data.image
    ? `
        <a href="${data.image}" target="_blank">
            <img
                src="${data.image}"
                class="chat-image"
                alt="Shared image">
        </a>
      `
    : data.text
}

        ${data.reaction ? `
            <div style="margin-top:5px;font-size:20px;">
                ${data.reaction}
            </div>
        ` : ""}

        ${data.edited ? "<small>(edited)</small>" : ""}
        <br>

        <small class="message-time">
            ${time} ${tick}
        </small>
    `;

    return div;

}