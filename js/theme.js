// =====================================
// Chativo Theme Manager
// =====================================


const themeBtn = document.getElementById("themeBtn");

const body = document.body;


// Load saved theme
function loadTheme(){

    const saved =
        localStorage.getItem("chativo-theme");


    if(saved === "dark"){

        body.classList.add("dark");

        updateIcon(true);

    }

    else if(saved === "light"){

        body.classList.remove("dark");

        updateIcon(false);

    }

    else {


        // Follow device theme

        if(
        window.matchMedia &&
        window.matchMedia(
        "(prefers-color-scheme: dark)"
        ).matches
        ){

            body.classList.add("dark");

            updateIcon(true);

        }

    }

}



// Toggle theme
function toggleTheme(){

    const dark =
    body.classList.toggle("dark");


    localStorage.setItem(
        "chativo-theme",
        dark ? "dark" : "light"
    );


    updateIcon(dark);

}



// Update moon/sun icon
function updateIcon(dark){

    if(!themeBtn) return;


    const icon =
    themeBtn.querySelector("i");


    if(!icon) return;


    if(dark){

        icon.className =
        "fa-solid fa-sun";

    }

    else{

        icon.className =
        "fa-solid fa-moon";

    }

}



// Button click
if(themeBtn){

    themeBtn.addEventListener(
    "click",
    toggleTheme
    );

}



// Initialize

loadTheme();