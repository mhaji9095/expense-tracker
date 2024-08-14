// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCu6y78sB0EKgoZzvCtROEPfAW5IFxEj7k",
  authDomain: "expense-track-61d00.firebaseapp.com",
  projectId: "expense-track-61d00",
  storageBucket: "expense-track-61d00.appspot.com",
  messagingSenderId: "713164672303",
  appId: "1:713164672303:web:1e0773ef427ff20a6825da"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);