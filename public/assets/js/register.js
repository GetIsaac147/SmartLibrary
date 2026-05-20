import { registrarLector } from "./auth.js";

const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        nombre: document.getElementById('name').value,
        matricula: document.getElementById('matricula').value,
        carrera: document.getElementById('carrera').value
    };
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;

    try {
        await registrarLector(email, pass, data);
        window.location.href = "dashboard.html";
    } catch (error) {
        alert("Error en registro: " + error.message);
    }
});