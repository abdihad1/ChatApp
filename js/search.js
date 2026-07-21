export function initMessageSearch(searchInput, messagesDiv) {

    searchInput.addEventListener("input", () => {

        const search = searchInput.value.toLowerCase();

        const messages = messagesDiv.querySelectorAll(".me, .other");

        messages.forEach((msg) => {

            if (msg.textContent.toLowerCase().includes(search)) {
                msg.style.display = "";
            } else {
                msg.style.display = "none";
            }

        });

    });

}