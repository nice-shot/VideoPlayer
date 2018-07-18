// Functions for changing the html page
const socialDisplay = require("./social_display");

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

// Reference firestore document
let videoRef = db.collection(collection).doc(videoId);

// Used to toggle thumbs display
let clickedThumbsUp = false;
let clickedThumbsDown = false;

// Used to prevent multiple clicks on the thumbs from effecting the DB
let thumbsUpdateLock = false;

// Promise functions
function ExtractVideoData(videoDoc) {
    if (videoDoc.exists) {
        return Promise.resolve(videoDoc.data());
    }
    return Promise.reject("Video not found in DB");
}

function UpdateSocialView(videoData) {
    socialDisplay.SetViews(videoData.views);
    socialDisplay.SetThumbs(videoData.likes, videoData.dislikes);
    // Each function returns the video data to allow aggregation
    return Promise.resolve(videoData);
}

function UpdateThumbsIcons() {
    socialDisplay.ToggleThumbsUp(clickedThumbsUp);
    socialDisplay.ToggleThumbsDown(clickedThumbsDown);
    // It's ok to click the thumbs again
    thumbsUpdateLock = false;
    return Promise.resolve();
}

function IncreaseViewsCount(videoData) {
    // Don't double check the data in firestore to reduce extra requests
    videoData.views += 1;
    return videoRef.update({views: videoData.views})
                   .then(() => Promise.resolve(videoData))
    ;
}

// Returns a promise function that changes the thumbs count
function ChangeThumbsCount(increase=true, thumbsUp=true) {
    let numToAdd = increase ? 1 : -1;
    let key = thumbsUp ? "likes" : "dislikes";
    return (videoData) => {
        videoData[key] += numToAdd;

        let updateObj = {};
        updateObj[key] = videoData[key];

        return videoRef.update(updateObj)
                       .then(() => Promise.resolve(videoData))
        ;
    };
}

// Onclick functions
function ThumbsUpOnClick() {
    if (thumbsUpdateLock) {
        return;
    }

    thumbsUpdateLock = true;

    let increase = true;
    if (clickedThumbsUp) {
        increase = false;
    }
    // Get latest data before updating it
    videoRef.get()
        .then(ExtractVideoData)
        .then(ChangeThumbsCount(increase, true))
        .then(UpdateSocialView)
        .then(() => clickedThumbsUp = !clickedThumbsUp)
        .then(UpdateThumbsIcons)
        .catch((error) => {
            console.error("Couldn't send thumbs up");
            console.error(error);
        })
    ;
}

function ThumbsDownOnClick() {
    // Very similar
    if (thumbsUpdateLock) {
        return;
    }

    thumbsUpdateLock = true;

    let increase = true;
    if (clickedThumbsDown) {
        increase = false;
    }

    videoRef.get()
        .then(ExtractVideoData)
        .then(ChangeThumbsCount(increase, false))
        .then(UpdateSocialView)
        .then(() => clickedThumbsDown = !clickedThumbsDown)
        .then(UpdateThumbsIcons)
        .catch((error) => {
            console.error("Couldn't send thumbs down");
            console.error(error);
        })
    ;
}


// Set button actions
socialDisplay.SetThumbsClickFunctions(ThumbsUpOnClick, ThumbsDownOnClick);

// Set the initial values to '?' to indicate loading
socialDisplay.SetViews("?");
socialDisplay.SetThumbs("?", "?");

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

