import { auth, db } from "./firebase.js";
import { showToast } from "./toast.js";
import { uploadProfileImage } from "./profile.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
    updateProfile
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const profilePreview = document.getElementById("profilePreview");
const displayName = document.getElementById("displayName");
const bio = document.getElementById("bio");
const email = document.getElementById("email");
const profileImage = document.getElementById("profileImage");
const saveProfile = document.getElementById("saveProfile");
const changePhotoBtn = document.getElementById("changePhotoBtn");

import {auth, db} from "./firebase.js";

import {
onAuthStateChanged,
updateProfile,
signOut
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";


import {
doc,
getDoc,
updateDoc
}
from
"https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


import {
uploadProfileImage
}
from "./profileUpload.js";


import {
showToast
}
from "./toast.js";



const profilePreview =
document.getElementById("profilePreview");


const profileImage =
document.getElementById("profileImage");


const changePhotoBtn =
document.getElementById("changePhotoBtn");


const displayName =
document.getElementById("displayName");


const bio =
document.getElementById("bio");


const bioCount =
document.getElementById("bioCount");


const username =
document.getElementById("username");


const onlineToggle =
document.getElementById("onlineToggle");


const readToggle =
document.getElementById("readToggle");


const notifyToggle =
document.getElementById("notifyToggle");


const wallpaper =
document.getElementById("wallpaper");


const saveProfile =
document.getElementById("saveProfile");



changePhotoBtn.onclick=()=>{

profileImage.click();

};



profilePreview.onclick=()=>{

profileImage.click();

};



profileImage.onchange=()=>{

const file =
profileImage.files[0];

if(!file)return;


profilePreview.src =
URL.createObjectURL(file);


profilePreview.classList.add(
"preview-animation"
);

};



bio.oninput=()=>{

bioCount.textContent =
`${bio.value.length}/120`;

};



onAuthStateChanged(
auth,
async user=>{


if(!user){

location.href="login.html";

return;

}


const snap =
await getDoc(
doc(db,"users",user.uid)
);


if(!snap.exists())return;


const data=snap.data();



displayName.value =
data.name || "";



bio.value =
data.bio || "";

bioCount.textContent =
`${bio.value.length}/120`;



username.value =
data.username || "";



if(data.photo){

profilePreview.src=data.photo;

}



onlineToggle.checked =
data.showOnline ?? true;


readToggle.checked =
data.readReceipts ?? true;


notifyToggle.checked =
data.notifications ?? true;


wallpaper.value =
data.wallpaper || "default";



});




saveProfile.onclick=
async()=>{


const user =
auth.currentUser;


if(!user)return;



saveProfile.disabled=true;

saveProfile.textContent=
"Saving...";



let photoUrl=null;



if(profileImage.files.length){


photoUrl =
await uploadProfileImage(
profileImage.files[0],
user.uid
);


}



await updateDoc(
doc(db,"users",user.uid),
{


name:
displayName.value.trim(),


bio:
bio.value.trim(),


username:
username.value.trim(),


showOnline:
onlineToggle.checked,


readReceipts:
readToggle.checked,


notifications:
notifyToggle.checked,


wallpaper:
wallpaper.value,


...(photoUrl && {
photo:photoUrl
})


});


await updateProfile(
user,
{


displayName:
displayName.value.trim(),


photoURL:
photoUrl ||
profilePreview.src


});


showToast(
"✨ Profile Updated"
);



saveProfile.disabled=false;

saveProfile.textContent=
"Save Changes";



setTimeout(()=>{

location.href="chat.html";

},800);



};




document
.getElementById("logoutBtn")
.onclick=
async()=>{


await signOut(auth);


location.href="login.html";


};