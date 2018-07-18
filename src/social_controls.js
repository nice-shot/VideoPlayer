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

function IncreaseViewsCount(videoData) {
    // Don't double check the data in firestore to reduce extra requests
    videoData.views += 1;
    return videoRef.update({views: videoData.views})
                   .then(() => Promise.resolve(videoData))
    ;
}

// Returns a promise function that changes the thumbs count
function ChangeThumbsCount(increase=true, isThumbsUp=true) {
    let numToAdd = increase ? 1 : -1;
    let key = isThumbsUp ? "likes" : "dislikes";
    return (videoData) => {
        videoData[key] += numToAdd;

        // Avoid updating unrelated fields
        let updateObj = {};
        updateObj[key] = videoData[key];

        return videoRef.update(updateObj)
                       .then(() => Promise.resolve(videoData))
        ;
    };
}

function UpdateThumbsIcons() {
    socialDisplay.ToggleThumbsUp(clickedThumbsUp);
    socialDisplay.ToggleThumbsDown(clickedThumbsDown);

    // It's ok to click the thumbs again
    thumbsUpdateLock = false;
    return Promise.resolve();
}

// Thumbs on click functions are very similar so we're using this closure
function CreateThumbsOnClick(isThumbsUp=true) {
    return () => {
        // Prevents changing thumbs while waiting for DB
        if (thumbsUpdateLock) {
            return;
        }
        thumbsUpdateLock = true;

        // Should we increase or decrease the thumbs up/down number?
        let increase = true;
        if ((isThumbsUp && clickedThumbsUp)
            || (!isThumbsUp && clickedThumbsDown)) {
            increase = false;
        }

        // Get latest data before updating it
        videoRef.get()
            .then(ExtractVideoData)
            .then(ChangeThumbsCount(increase, isThumbsUp))
            .then(UpdateSocialView)
            .then(() => {
                // Change thumbs click booleans
                if (isThumbsUp) {
                    clickedThumbsUp = !clickedThumbsUp;
                } else {
                    clickedThumbsDown = !clickedThumbsDown;
                }
            })
            .then(UpdateThumbsIcons)
            .catch((error) => {
                let thumbDirection = isThumbsUp ? "up" : "down";
                console.error("Couldn't send thumbs " + thumbDirection);
                console.error(error);
        })
    };
}

// Set button actions
socialDisplay.SetThumbsClickFunctions(CreateThumbsOnClick(true),
                                      CreateThumbsOnClick(false));

// Set the initial values to '?' to indicate loading
socialDisplay.SetViews("?");
socialDisplay.SetThumbs("?", "?");

// Check social info, update number of views and display on page
videoRef.get()
    .then(ExtractVideoData)
    // Update immediately upon page hit - no validation of actual video viewing
    .then(IncreaseViewsCount)
    .then(UpdateSocialView)
    .catch((error) => {
        console.error("Problem getting social data");
        console.error(error);
    })
;

