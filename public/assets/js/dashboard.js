import { auth, db } from "./firebase.js";
import { logoutUser } from "./auth.js";
import { ADMIN_EMAIL } from "./auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const navUserName     = document.getElementById("navUserName");
const userName        = document.getElementById("userName");
const profileUserName = document.getElementById("profileUserName");
const userEmail       = document.getElementById("userEmail");
const logoutBtn       = document.getElementById("logoutBtn");
const editProfileForm = document.getElementById("editProfileForm");
const editName        = document.getElementById("editName");
const editEmail       = document.getElementById("editEmail");
const profileAlert    = document.getElementById("profileAlert");
const profileSuccess  = document.getElementById("profileSuccess");

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  if (user.email === ADMIN_EMAIL) {
    window.location.href = "dashboard-admin.html";
    return;
  }

  currentUser = user;

  try {
    const userRef  = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      navUserName.textContent     = data.nombre || "Usuario";
      userName.textContent        = data.nombre || "Usuario";
      profileUserName.textContent = data.nombre || "Usuario";
      userEmail.textContent       = user.email;
      editName.value              = data.nombre || "";
      editEmail.value             = user.email;
    } else {
      navUserName.textContent     = "Usuario";
      userName.textContent        = "Usuario";
      profileUserName.textContent = "Usuario";
      userEmail.textContent       = user.email;
      editEmail.value             = user.email;
    }
  } catch (error) {
    console.error(error);
  }
});

logoutBtn?.addEventListener("click", async () => {
  await logoutUser();
  window.location.href = "login.html";
});

editProfileForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentUser) return;

  const nuevoNombre = editName.value.trim();
  if (!nuevoNombre) {
    profileAlert.textContent = "El nombre no puede estar vacío.";
    profileAlert.classList.remove("d-none");
    return;
  }

  try {
    profileAlert.classList.add("d-none");
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, { nombre: nuevoNombre });

    navUserName.textContent     = nuevoNombre;
    userName.textContent        = nuevoNombre;
    profileUserName.textContent = nuevoNombre;

    profileSuccess.textContent = "Perfil actualizado correctamente.";
    profileSuccess.classList.remove("d-none");
    setTimeout(() => profileSuccess.classList.add("d-none"), 3000);
  } catch (error) {
    profileAlert.textContent = "Error al guardar los cambios.";
    profileAlert.classList.remove("d-none");
  }
});