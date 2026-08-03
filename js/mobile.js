// =====================================
// Chativo Mobile Navigation V5
// WhatsApp + Telegram + iOS Style
// =====================================


const sidebar = document.querySelector(".sidebar");

const chat = document.querySelector(".chat");

const backBtn = document.getElementById("backBtn");



function isMobile(){

    return window.innerWidth <= 900;

}



// Open selected chat

export function openChat(){


    if(!isMobile()) return;


    sidebar.classList.add("hide");


    chat.classList.add("active");


    document.body.classList.add(
        "chat-open"
    );


}




// Close chat and return sidebar

export function closeChat(){


    if(!isMobile()) return;


    sidebar.classList.remove("hide");


    chat.classList.remove("active");


    document.body.classList.remove(
        "chat-open"
    );


}





// Back button

if(backBtn){


    backBtn.onclick = ()=>{


        closeChat();


    };


}





// Listen chat selection event

document.addEventListener(
"chatSelected",
()=>{


    openChat();


});







// Handle browser resize

window.addEventListener(
"resize",
()=>{


if(window.innerWidth > 900){


    sidebar.classList.remove(
        "hide"
    );


    chat.classList.remove(
        "active"
    );


    document.body.classList.remove(
        "chat-open"
    );


}



});





// Android back button support

window.addEventListener(
"popstate",
()=>{


if(
document.body.classList.contains(
"chat-open"
)
){


    closeChat();


}


});