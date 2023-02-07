import * as firebase from 'firebase';
import '@firebase/firestore';

// Beginning of Firabase configuration information.
const firebaseConfig = {
    apiKey: "AIzaSyDBj5ed2qhMgNpFZA-cmChCR6Xyl5_kzCo",
    authDomain: "owlguardproject.firebaseapp.com",
    projectId: "owlguardproject",
    storageBucket: "owlguardproject.appspot.com",
    messagingSenderId: "496663558359",
    appId: "1:496663558359:web:b18961bcfa78d737045892",
    measurementId: "G-2DRMXXH1YY"
};
// End of Firabase configuration information.

// Beginning of Firebase initialization.
var app;
if (!firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig);
}else {
    app = firebase.app(); // if already initialized, use that one
}
// End of Firebase initialization.

// Exports constants.
export const db = app.database();
export const firestore = firebase.firestore(app);
export const auth = app.auth();