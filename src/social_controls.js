// Firebase initialization
const firebase = require("firebase/app");
require("firebase/firestore");
const config = require("./firebase_config.json");

const app = firebase.initializeApp(config);
const db = firebase.firestore();

// Used to avoid a warning by firebase
db.settings({
    timestampsInSnapshots: true
});

// Theoritacally we could take this from the DB but we only
// have the one movie so it's hard-coded
const videoId = "kAIgdmnGLG5awuzlUUpB";
const collection = "videos";

// Prepare html elements
const viewsElement = document.getElementsByClassName("views")[0];
const thumbsUpBtn = document.getElementById("thumbsUp");
const thumbsDownBtn = document.getElementById("thumbsDown");

let videoRef = db.collection(collection).doc(videoId);

// Utility functions
function SetViews(numOfViews) {
    viewsElement.innerText = numOfViews;
}

function SetThumbs(thumbsUp, thumbsDown) {
    thumbsUpBtn.innerText = "thumbsUp: " + thumbsUp;
    thumbsDownBtn.innerText = "thumbsUp: " + thumbsDown;
}

// Set the initial values to '...' to indicate loading
SetViews("?");
SetThumbs("?", "?");



videoRef.get().then((video) => {
    if (video.exists) {
        videoData = video.data();
        SetViews(videoData.views);
        SetThumbs(videoData.likes, videoData.dislikes);
    } else {
        console.error("video not found");
    }
}).catch((error) => {
    console.error("couldn't connect to video");
    console.error(error);
});

thumbsUpBtn.onclick = () => {
    videoRef.get().then((video) => {
        if (video.exists) {
            videoData = video.data();
            videoRef.update({likes: videoData.likes + 1})
                    .then(() => {
                       SetThumbs(videoData.likes + 1, videoData.dislikes)
                    })
            ;
        } else {
            console.error("video not found");
        }
    }).catch((error) => {
        console.error("couldn't connect to video");
        console.error(error);
    });
};
