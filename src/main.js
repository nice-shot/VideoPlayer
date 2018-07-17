const firebase = require("firebase/app");
require("firebase/firestore");
const app = firebase.initializeApp({
    apiKey: "AIzaSyAg00Gp2H40RF6EHSYm45BPvSYMhxn01iQ",
    authDomain: "videoplayer-ee996.firebaseapp.com",
    databaseURL: "https://videoplayer-ee996.firebaseio.com",
    projectId: "videoplayer-ee996",
    storageBucket: "",
    messagingSenderId: "711006215680"
});

const viewsDisplay = require("./views_display.js");

const db = firebase.firestore();
db.settings({
    timestampsInSnapshots: true
});

const videoId = "kAIgdmnGLG5awuzlUUpB";

db.collection("videos").doc(videoId).get().then((video) => {
    if (video.exists) {
        videoData = video.data();
        viewsDisplay.SetViews(videoData.views);
    } else {
        console.error("video not found");
    }
}).catch((error) => {
    console.error("couldn't connect to video");
    console.error(error);
});

require("./video_controls");
