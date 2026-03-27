// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEkL6ZdJO7VZ8-SsCZFRM1NB5dAGobkjg",
  authDomain: "yourtube-36d46.firebaseapp.com",
  projectId: "yourtube-36d46",
  storageBucket: "yourtube-36d46.firebasestorage.app",
  messagingSenderId: "23237092067",
  appId: "1:23237092067:web:c96f7f69a7d82b56445bd6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
