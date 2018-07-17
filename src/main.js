const firebase = require("firebase/app");
require("firebase/firestore");
// Avoid placing authentication data in git
const firebaseConfig = require("./firebase_config.json");
const app = firebase.initializeApp(firebaseConfig);

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
