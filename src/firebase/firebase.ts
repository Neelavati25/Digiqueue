// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCBgyfOt_JdPPZIKIzNhV2ZrM5nxfZAKs",
  authDomain: "digiqueue-24c5e.firebaseapp.com",
  projectId: "digiqueue-24c5e",
  storageBucket: "digiqueue-24c5e.firebasestorage.app",
  messagingSenderId: "112781978432",
  appId: "1:112781978432:web:6d02f02a4bb59f058168a5",
  measurementId: "G-W3JE094804"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);