// Utility functions to help separate view from logic

// Prepare html elements
const viewsElem = document.getElementsByClassName("views")[0];
const thumbsUpBtn = document.getElementById("thumbsUp");
const thumbsDownBtn = document.getElementById("thumbsDown");
const thumbsUpImg = thumbsUpBtn.getElementsByTagName("img")[0];
const thumbsDownImg = thumbsDownBtn.getElementsByTagName("img")[0];

const thumbsUpImgSrc = "images/thumbs_up.png"
const thumbsDownImgSrc = "images/thumbs_down.png"

function ClickedSrc(imageSrc) {
    return imageSrc.substring(0, imageSrc.length-4) + "_clicked.png";
}

module.exports = {
    SetViews: (numOfViews) => {
        viewsElem.innerText = numOfViews;
    },

    SetThumbs: (thumbsUp, thumbsDown) => {
        thumbsUpBtn.getElementsByTagName("span")[0].innerText = thumbsUp;
        thumbsDownBtn.getElementsByTagName("span")[0].innerText = thumbsDown;
    },

    ToggleThumbsUp: (clicked) => {
        if (clicked) {
            thumbsUpImg.src = ClickedSrc(thumbsUpImgSrc);
        } else {
            thumbsUpImg.src = thumbsUpImgSrc;
        }
    },

    ToggleThumbsDown: (clicked) => {
        if (clicked) {
            thumbsDownImg.src = ClickedSrc(thumbsDownImgSrc);
        } else {
            thumbsDownImg.src = thumbsDownImgSrc;
        }
    },

    SetThumbsClickFunctions: (upClickFunction, downClickFunction) => {
        thumbsUpBtn.onclick = upClickFunction;
        thumbsDownBtn.onclick = downClickFunction;
    }

}
