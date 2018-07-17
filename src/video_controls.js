// Used for duration formatting
const luxon = require("luxon");

// Setup html elements
const videoElem = document.getElementsByTagName("video")[0];
const playPauseBtn = document.getElementById("playPause");
const currentTimeElem = document.getElementsByClassName("currentTime")[0];


// Utility functions
function PlayPause() {
    if (videoElem.paused) {
        videoElem.play();
    } else {
        videoElem.pause();
    }
}

function UpdateTimeDisplay() {
    let duration = luxon.Duration.fromObject({seconds: videoElem.currentTime});
    currentTimeElem.innerText = duration.toFormat("mm:ss");
}


// Set buttons
playPauseBtn.onclick = PlayPause;
videoElem.ontimeupdate = UpdateTimeDisplay;
