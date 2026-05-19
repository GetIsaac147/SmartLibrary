import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyATEajobHMt7cbzFTPnIqE2k-LEASebHx4",
  authDomain: "smartlibrary-627ad.firebaseapp.com",
  projectId: "smartlibrary-627ad",
  storageBucket: "smartlibrary-627ad.firebasestorage.app",
  messagingSenderId: "174518888331",
  appId: "1:174518888331:web:1467617c4032a1da51718e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const registerUser = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await setDoc(doc(db, "users", user.uid), {
      ...userData,
      email: email,
      uid: user.uid,
      createdAt: new Date().toISOString()
    });
    
    return user;
  } catch (error) {
    throw error;
  }
};