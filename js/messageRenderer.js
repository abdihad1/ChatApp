export function createMessageElement(data) {

    const div = document.createElement("div");

    const mine = data.uid === data.currentUserId;

    div.className = mine
    ? "message me"
    : "message other";

    const time = data.createdAt
        ? new Date(data.createdAt.seconds * 1000)
            .toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })
        : "";

    const tick = mine
        ? (data.read ? "✓✓" : "✓")
        : "";

div.innerHTML = `

<div class="message-content">

${data.type === "group"
? `<div class="sender-name">${data.name}</div>`
: ""}

${data.replyTo
? `
<div class="reply-box">
↩ ${data.replyTo}
</div>
`
: ""}

${
data.image
?
`
<img
src="${data.image}"
class="chat-image"
alt="Image">
`
:
data.voice
?
`
<audio controls class="voice-message">
<source src="${data.voice}" type="audio/webm">
</audio>
`
:
`
<div class="message-text">
${data.text || ""}
</div>
`
}

${data.reaction
?
`
<div class="message-reaction">
${data.reaction}
</div>
`
:
""}

<div class="message-footer">

${data.edited
?
`<span class="edited">(edited)</span>`
:
""}

<span class="message-time">
${time}
</span>

${tick
?
`<span class="read">${tick}</span>`
:
""}

</div>

</div>

`;

    return div;

}