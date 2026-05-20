import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAFd-zsbiOy3YYK49q37WLlUq9hSZKyBx8",
  authDomain: "smartlibrary-201b0.firebaseapp.com",
  projectId: "smartlibrary-201b0",
  storageBucket: "smartlibrary-201b0.firebasestorage.app",
  messagingSenderId: "612543856076",
  appId: "1:612543856076:web:5bc1492c65c3853467b169",
  measurementId: "G-Z5B7HRG5EJ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);