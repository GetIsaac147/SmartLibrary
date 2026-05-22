import { loginUser, observarSesion, ADMIN_EMAIL } from "./auth.js";

observarSesion((user) => {
  if (!user) return;
  if (user.email === ADMIN_EMAIL) {
    window.location.href = "./dashboard-admin.html";
  } else {
    window.location.href = "./dashboard.html";
  }
});

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const pass = document.getElementById('loginPassword').value;

  try {
    await loginUser(email, pass);
    // La redirección la maneja observarSesion arriba

  } catch (error) {
    alert("Acceso denegado: " + error.message);
  }
});