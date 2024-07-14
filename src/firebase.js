
import { initializeApp } from "firebase/app"; 
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAAOupPFUQ1wZK6lFq8UZLwdIovj6yJyz8",
  authDomain: "chat-5e375.firebaseapp.com",
  projectId: "chat-5e375",
  storageBucket: "chat-5e375.appspot.com",
  messagingSenderId: "73009946633",
  appId: "1:73009946633:web:228e46d616aa3864c858d8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();