import { auth, db } from "./firebase.js";
import { getBooks } from "./books.js";
import { logoutUser } from "./auth.js"; 
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const navUserName = document.getElementById("navUserName");
const userName = document.getElementById("userName");
const profileUserName = document.getElementById("profileUserName");
const userEmail = document.getElementById("userEmail");
const booksContainer = document.getElementById("booksContainer");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
const userSnap = await getDoc(userRef);

if (userSnap.exists()) {

    const data = userSnap.data();

    // Si es admin lo mandamos al panel admin
    if (data.role === "admin") {
        window.location.href = "dashboard-admin.html";
        return;
    }

    // Datos del lector
    if(navUserName) navUserName.textContent = data.nombre || "Usuario";
    if(userName) userName.textContent = data.nombre || "Usuario";
    if(profileUserName) profileUserName.textContent = data.nombre || "Usuario";
    if(userEmail) userEmail.textContent = user.email;
}

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      if(navUserName) navUserName.textContent = data.nombre || "Usuario";
      if(userName) userName.textContent = data.nombre || "Usuario";
      if(profileUserName) profileUserName.textContent = data.nombre || "Usuario";
      if(userEmail) userEmail.textContent = user.email;
    }
  } catch (error) {
    console.error("Error al obtener perfil:", error);
  }
});

async function cargarLibros() {
    if (!booksContainer) return;

    const books = await getBooks();
    booksContainer.innerHTML = "";
    
    if (books.length === 0) {
        booksContainer.innerHTML = "<p class='text-center text-muted'>No hay libros disponibles en este momento.</p>";
        return;
    }

    books.forEach((book) => {
        booksContainer.innerHTML += `
            <div class="card p-3 mb-3">
                <h4 class="text-white">${book.title}</h4>
                <p><strong>Autor:</strong> ${book.author}</p>
                <p><strong>Categoría:</strong> <span class="badge bg-info">${book.category || 'General'}</span></p>
                <div class="d-grid mt-2">
                    <button class="btn btn-outline-primary btn-sm">Solicitar Préstamo</button>
                </div>
            </div>
        `;
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        await logoutUser();
        window.location.href = "login.html";
    });
}

if (booksContainer) {
    cargarLibros();
}