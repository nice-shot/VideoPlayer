const firebase = require("firebase/app");
// require("firebase/firestore");
// const firestore = firebase.firestore();
const app = firebase.initializeApp({
    apiKey: "AIzaSyAg00Gp2H40RF6EHSYm45BPvSYMhxn01iQ",
    authDomain: "videoplayer-ee996.firebaseapp.com",
    databaseURL: "https://videoplayer-ee996.firebaseio.com",
    projectId: "videoplayer-ee996",
    storageBucket: "",
    messagingSenderId: "711006215680" 
});
// const db = firebase.firestore();
// db.settings({
//     timestampsInSnapshots: true
// });

// db.collection("videos").get().then((querySnapshot) => {
//     querySnapshot.forEach((video) => {
//         console.log("${video.id} => ${video.data()}");
//     });
// });