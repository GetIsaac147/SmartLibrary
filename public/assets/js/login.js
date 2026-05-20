import { loginUser } from "./auth.js";

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPassword').value;

    try {
        await loginUser(email, password);
        window.location.href = "dashboard.html";
    } catch (error) {
        alert("Acceso denegado: " + error.message);
    }
});