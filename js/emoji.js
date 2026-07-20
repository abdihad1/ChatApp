const emojiBtn = document.getElementById("emojiBtn");
const picker = document.getElementById("emojiPicker");
const input = document.getElementById("message");

emojiBtn.onclick = () => {

    picker.style.display = "flex";

};

picker.addEventListener("click", (e) => {

    if (e.target.tagName !== "SPAN") return;

    input.value += e.target.textContent;

    picker.style.display = "none";

    input.focus();

});