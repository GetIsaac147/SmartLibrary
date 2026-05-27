import { loginUser, observarSesion } from "./auth.js";

import { db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;

  try {

    const userCredential = await loginUser(email, pass);
    const user = userCredential;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("Usuario no encontrado en base de datos");
    }

    const data = userSnap.data();
    const role = data.role || "lector";

    if (role === "admin") {
      window.location.href = "./dashboard-admin.html";
    } else {
      window.location.href = "./dashboard.html";
    }

  } catch (error) {
    alert("Acceso denegado: " + error.message);
  }
});