// =====================================
// Chativo Mobile Navigation
// WhatsApp Style
// =====================================


const sidebar = document.querySelector(".sidebar");
const chat = document.querySelector(".chat");

const backBtn = document.getElementById("backBtn");


// Open chat on mobile
export function openChat(){

    if(window.innerWidth <= 768){

        sidebar.classList.add("hide");

        chat.classList.add("active");

    }

}



// Go back to sidebar
export function closeChat(){

    if(window.innerWidth <= 768){

        sidebar.classList.remove("hide");

        chat.classList.remove("active");

    }

}



// Back button
if(backBtn){

    backBtn.addEventListener("click",()=>{

        closeChat();

    });

}



// When selecting user from sidebar
document.addEventListener(
"chatSelected",
()=>{

    openChat();

});




// Reset when resizing
window.addEventListener(
"resize",
()=>{


if(window.innerWidth > 768){

    sidebar.classList.remove("hide");

    chat.classList.remove("active");

}


});