import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDn4aFWKEk_j5_SvgTqM88dO9e4iBGYPQc",
    authDomain: "rh-integrity.firebaseapp.com",
    projectId: "rh-integrity",
    storageBucket: "rh-integrity.firebasestorage.app",
    messagingSenderId: "734916290985",
    appId: "1:734916290985:web:e3c668d851cedfb7827cb8"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;