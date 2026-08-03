//
// =====================================
// Chativo V5 Theme Manager
// iOS + Telegram + WhatsApp Style
// =====================================


const themeBtn =
document.getElementById("themeBtn");


const body =
document.body;



function applyTheme(theme){


if(theme === "dark"){


    body.classList.add("dark");


    document.documentElement
    .setAttribute(
        "data-theme",
        "dark"
    );


    updateIcon(true);


}

else{


    body.classList.remove("dark");


    document.documentElement
    .setAttribute(
        "data-theme",
        "light"
    );


    updateIcon(false);


}


}




function loadTheme(){


const saved =
localStorage.getItem(
"chativo-theme"
);



if(saved){


    applyTheme(saved);


    return;


}



const systemDark =
window.matchMedia &&
window.matchMedia(
"(prefers-color-scheme: dark)"
).matches;



applyTheme(
systemDark
?
"dark"
:
"light"
);



}





function toggleTheme(){


const dark =
body.classList.contains(
"dark"
);



const newTheme =
dark
?
"light"
:
"dark";



localStorage.setItem(
"chativo-theme",
newTheme
);



applyTheme(
newTheme
);



}





function updateIcon(dark){


if(!themeBtn)
return;



const icon =
themeBtn.querySelector("i");



if(!icon)
return;



icon.className =
dark
?
"fa-solid fa-sun"
:
"fa-solid fa-moon";



}





if(themeBtn){


themeBtn.onclick =
toggleTheme;


}




// React to system changes

window
.matchMedia(
"(prefers-color-scheme: dark)"
)
.addEventListener(
"change",
(e)=>{


if(
!localStorage.getItem(
"chativo-theme"
)
){


applyTheme(
e.matches
?
"dark"
:
"light"
);


}


});




loadTheme();