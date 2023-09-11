// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCxsqjrdAnvPE3OxGCAtKRfe3XT0BcStfs",
    authDomain: "notes-ai-a30ea.firebaseapp.com",
    projectId: "notes-ai-a30ea",
    storageBucket: "notes-ai-a30ea.appspot.com",
    messagingSenderId: "451539755007",
    appId: "1:451539755007:web:6c37dd31a32c67224d51ca"
  };  

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
