import { auth } from "./auth.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPassword').value;

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        window.location.href = "dashboard.html";
    } catch (error) {
        alert("Acceso denegado: " + error.message);
    }
});