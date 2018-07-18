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

// Theoritacally we could take the video ID from the DB but we only
// have one so it's hard-coded
const videoId = "kAIgdmnGLG5awuzlUUpB";
const collection = "videos";

// Prepare html elements
const viewsElem = document.getElementsByClassName("views")[0];
const thumbsUpBtn = document.getElementById("thumbsUp");
const thumbsDownBtn = document.getElementById("thumbsDown");

// Utility functions
function SetViews(numOfViews) {
    viewsElem.innerText = numOfViews;
}

function SetThumbs(thumbsUp, thumbsDown) {
    thumbsUpBtn.getElementsByTagName("span")[0].innerText = thumbsUp;
    thumbsDownBtn.getElementsByTagName("span")[0].innerText = thumbsDown;
    // thumbsUpBtn.innerText = "thumbsUp: " + thumbsUp;
    // thumbsDownBtn.innerText = "thumbsDown: " + thumbsDown;
}

// Reference firestore document
let videoRef = db.collection(collection).doc(videoId);

// Promise functions
function ExtractVideoData(videoDoc) {
    if (videoDoc.exists) {
        return Promise.resolve(videoDoc.data());
    }
    return Promise.reject("Video not found in DB");
}

function UpdateSocialView(videoData) {
    SetViews(videoData.views);
    SetThumbs(videoData.likes, videoData.dislikes);
    // Each function returns the video data to allow aggregation
    return Promise.resolve(videoData);
}

function IncreaseViewsCount(videoData) {
    // Don't double check the data in firestore to reduce extra requests
    videoData.views += 1;
    return videoRef.update({views: videoData.views})
                   .then(() => Promise.resolve(videoData))
    ;
}

function IncreaseThumbsUpCount(videoData) {
    videoData.likes += 1;
    return videoRef.update({likes: videoData.likes})
                   .then(() => Promise.resolve(videoData))
    ;
}

function IncreaseThumbsDownCount(videoData) {
    videoData.dislikes += 1;
    return videoRef.update({dislikes: videoData.dislikes})
                   .then(() => Promise.resolve(videoData))
    ;
}

// Set button actions

thumbsUpBtn.onclick = () => {
    // Get latest data before updating it
    videoRef.get()
        .then(ExtractVideoData)
        .then(IncreaseThumbsUpCount)
        .then(UpdateSocialView)
        .catch((error) => {
            console.error("Couldn't send thumbs up");
            console.error(error);
        })
    ;
};

thumbsDownBtn.onclick = () => {
    videoRef.get()
        .then(ExtractVideoData)
        .then(IncreaseThumbsDownCount)
        .then(UpdateSocialView)
        .catch((error) => {
            console.error("Couldn't send thumbs down");
            console.error(error);
        })
    ;
};

// Set the initial values to '?' to indicate loading
SetViews("?");
SetThumbs("?", "?");

// Check social info, update number of views and display on page
videoRef.get()
    .then(ExtractVideoData)
    // Update immidiatly upon page hit - no validation of actual video viewing
    .then(IncreaseViewsCount)
    .then(UpdateSocialView)
    .catch((error) => {
        // Should probably change views to be unresponsive
        console.error("Problem getting social data");
        console.error(error);
    })
;

