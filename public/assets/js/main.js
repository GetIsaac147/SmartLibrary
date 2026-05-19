import { auth, db } from "./auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { createBook, getBooks } from "./books.js";

onAuthStateChanged(auth, async (user) => {
    const navName = document.getElementById('navUserName');
    const currentPath = window.location.pathname;

    if (user) {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists() && navName) {
                navName.textContent = userDoc.data().nombre;
            }
        } catch (error) {
            console.error("Error al cargar perfil:", error);
        }

        if (currentPath.includes("login.html") || currentPath.includes("register.html")) {
            window.location.href = "dashboard.html";
        }
    } else {
        if (currentPath.includes("dashboard.html")) {
            window.location.href = "login.html";
        }
    }
});

const form = document.getElementById("bookForm");

if (form) {
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
        loadBooks(); 
    });
}

async function loadBooks() {
    const books = await getBooks();
    const container = document.getElementById("booksContainer");
    if (!container) return;
    
    container.innerHTML = "";
    books.forEach((book) => {
        container.innerHTML += `
        <div class="book-card">
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <button class="delete-btn" data-id="${book.id}">Eliminar</button>
        </div>`;
    });
}

document.addEventListener("DOMContentLoaded", loadBooks);