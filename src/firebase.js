// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBGb20H9JfxSfJ9f0Rqipadg2ppKrvq5ts",
  authDomain: "saas-calculator-007.firebaseapp.com",
  projectId: "saas-calculator-007",
  storageBucket: "saas-calculator-007.firebasestorage.app",
  messagingSenderId: "472451808353",
  appId: "1:472451808353:web:6e0dc3795a6d614855be20",
  measurementId: "G-3KH2MY9886"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;
