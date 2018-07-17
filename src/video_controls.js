const luxon = require("luxon");

const videoElem = document.getElementsByTagName("video")[0];
const playPauseBtn = document.getElementById("playPause");
const currentTimeElem = document.getElementsByClassName("currentTime")[0];

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

playPauseBtn.onclick = PlayPause;
videoElem.ontimeupdate = UpdateTimeDisplay;
