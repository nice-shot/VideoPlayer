// Used for duration formatting
const luxon = require("luxon");

// Setup html elements
const videoElem = document.getElementsByTagName("video")[0];
const playPauseBtn = document.getElementById("playPause");
const playPauseIcon = playPauseBtn.getElementsByTagName("img")[0];
const currentTimeElem = document.getElementsByClassName("currentTime")[0];

// Play-pause images
const playImg = "images/play.png"
const pauseImg = "images/pause.png"

// Utility functions
function PlayPause() {
    if (videoElem.paused) {
        videoElem.play();
        playPauseIcon.src = pauseImg;
    } else {
        videoElem.pause();
        playPauseIcon.src = playImg;
    }
}

function UpdateTimeDisplay() {
    let duration = luxon.Duration.fromObject({seconds: videoElem.currentTime});
    currentTimeElem.innerText = duration.toFormat("mm:ss");
}


// Set buttons
playPauseBtn.onclick = PlayPause;
videoElem.ontimeupdate = UpdateTimeDisplay;
