// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAdqkILEvYSLwe0LtqJn0y1RRzPGEvQgPg",
  authDomain: "gemini-project-f477e.firebaseapp.com",
  projectId: "gemini-project-f477e",
  storageBucket: "gemini-project-f477e.appspot.app",
  messagingSenderId: "395552508074",
  appId: "1:395552508074:web:97ceb877630e9fd855e8d3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
