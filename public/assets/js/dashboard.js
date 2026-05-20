import { auth, db } from "./firebase.js";
import { createBook, getBooks, deleteBook } from "./books.js";
import { logoutUser, observarSesion } from "./auth.js";

import { onAuthStateChanged,  signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc,  getDoc} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Constantes de usuario
const navUserName = document.getElementById("navUserName");
const userName = document.getElementById("userName");
const profileUserName = document.getElementById("profileUserName");
const userEmail = document.getElementById("userEmail");

// constantes de libros
const form = document.getElementById("bookForm");
const booksContainer = document.getElementById("booksContainer");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, async(user) => {

  if(!user){
    window.location.href = "login.html";
    return;
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if(userSnap.exists()){
      const data = userSnap.data();
      navUserName.textContent = data.nombre || "Usuario";
      userName.textContent = data.nombre || "Usuario";
      profileUserName.textContent = data.nombre || "Usuario";
      userEmail.textContent = user.email;
    } else {
      navUserName.textContent = "Usuario";
      userName.textContent = "Usuario";
      profileUserName.textContent = "Usuario";
      userEmail.textContent = user.email;
    }
  } catch(error){
    console.error(error);
  }
});

async function cargarLibros() {
    const books = await getBooks();
    
    booksContainer.innerHTML = "";
    
    books.forEach((book) => {
        booksContainer.innerHTML += `
            <div class="card p-3 mb-3">
                <h4>${book.title}</h4>
                <p><strong>Autor:</strong> ${book.author}</p>
                <p><strong>ISBN:</strong> ${book.isbn}</p>
                <button class="btn btn-danger delete-btn" data-id="${book.id}">
                    Eliminar
                </button>
            </div>
        `;
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
            await deleteBook(btn.dataset.id);
            await cargarLibros();
        });
    });
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const book = {
        title: document.getElementById("title").value,
        isbn: document.getElementById("isbn").value,
        author: document.getElementById("author").value,
        category: document.getElementById("category").value,
        totalCopies: parseInt(document.getElementById("totalCopies").value),
        available: parseInt(document.getElementById("available").value)
    };

    await createBook(book);
    form.reset();
    await cargarLibros();
});

logoutBtn.addEventListener("click", async () => {
    await logoutUser();
    window.location.href = "login.html";
});

cargarLibros();