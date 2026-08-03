/* =====================================
   CHATIVO V5 SERVICE WORKER
   WhatsApp + Telegram PWA Style
===================================== */


const CACHE_NAME = "chativo-v27";


const APP_FILES = [

    "/",

    "/chat.html",

    "/login.html",

    "/signup.html",

    "/css/style.css",

    "/css/modern.css",

    "/js/chat.js",

    "/js/sidebar.js",

    "/js/messageRenderer.js",

    "/manifest.json"

];





// INSTALL

self.addEventListener(
"install",
event=>{


    self.skipWaiting();


    event.waitUntil(

        caches.open(
            CACHE_NAME
        )
        .then(cache=>{

            return cache.addAll(
                APP_FILES
            );

        })

    );


});








// ACTIVATE

self.addEventListener(
"activate",
event=>{


event.waitUntil(


    caches.keys()

    .then(keys=>{


        return Promise.all(

            keys.map(key=>{


                if(
                    key !== CACHE_NAME
                ){

                    return caches.delete(
                        key
                    );

                }


            })

        );


    })


    .then(()=>{


        return self.clients.claim();


    })


);


});









// FETCH


self.addEventListener(
"fetch",
event=>{


const request =
event.request;


const url =
new URL(
request.url
);




// Ignore Firebase

if(

url.hostname.includes(
"firebase"
)

||

url.hostname.includes(
"googleapis"
)

||

url.hostname.includes(
"gstatic"
)

){

return;

}





// HTML NETWORK FIRST

if(
request.mode === "navigate"
){


event.respondWith(


fetch(request)

.then(response=>{


const clone =
response.clone();


caches.open(
CACHE_NAME
)
.then(cache=>{

cache.put(
request,
clone
);


});


return response;


})


.catch(()=>{


return caches.match(
"/chat.html"
);


})


);


return;


}







// STATIC CACHE FIRST

event.respondWith(


caches.match(request)

.then(cached=>{


return cached || fetch(request);


})


);



});