const viewsElement = document.getElementsByClassName("views")[0];
module.exports = {
    SetViews: (numOfViews) => {
            viewsElement.innerText = numOfViews;
    }
}