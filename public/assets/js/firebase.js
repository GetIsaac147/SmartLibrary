  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyATEajobHMt7cbzFTPnIqE2k-LEASebHx4",
    authDomain: "smartlibrary-627ad.firebaseapp.com",
    projectId: "smartlibrary-627ad",
    storageBucket: "smartlibrary-627ad.firebasestorage.app",
    messagingSenderId: "174518888331",
    appId: "1:174518888331:web:1467617c4032a1da51718e"
  };

  const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);