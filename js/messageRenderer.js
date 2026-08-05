export function createMessageElement(data) {

    const div = document.createElement("div");

    const mine = data.uid === data.currentUserId;

    div.className = mine
        ? "message sent"
        : "message received";

    const time = data.createdAt
        ? new Date(data.createdAt.seconds * 1000)
            .toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })
        : "";

    div.innerHTML = `

<div class="message-content">

${data.type === "group"
? `
<div class="sender-name">
${data.name || ""}
</div>
`
: ""}

${data.replyTo
? `
<div class="reply-box">

<div class="reply-title">
Reply
</div>

<div class="reply-text">
${data.replyTo}
</div>

</div>
`
: ""}

${data.image
? `
<img
src="${data.image}"
class="chat-image"
alt="image">
`
: data.voice
? `
<audio controls class="voice-message">
<source src="${data.voice}" type="audio/webm">
</audio>
`
: `
<div class="message-text">
${data.text || ""}
</div>
`}

${data.reaction
? `
<div class="message-reaction">
${data.reaction}
</div>
`
: ""}

<div class="message-time">

${time}

${mine
? `
<span class="read-status">

${
data.read
? `<i class="fa-solid fa-check-double read-check"></i>`
: data.delivered
? `<i class="fa-solid fa-check-double delivered-check"></i>`
: `<i class="fa-solid fa-check sent-check"></i>`
}

</span>
`
: ""}

${data.edited
? `
<span class="edited">
edited
</span>
`
: ""}

</div>

</div>

`;

    return div;

}