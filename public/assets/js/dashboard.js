import { auth, db } from "./firebase.js";
import { getBooks, updateBook } from "./books.js";
import { logoutUser, ADMIN_EMAILS } from "./auth.js"; 
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getLoansByUser, returnLoan, createLoan } from "./loans.js";

let nombreUsuarioActual = "Usuario";
const navUserName = document.getElementById("navUserName");
const userName = document.getElementById("userName");
const profileUserName = document.getElementById("profileUserName");
const userEmail = document.getElementById("userEmail");
const booksContainer = document.getElementById("booksContainer");
const userLoansContainer = document.getElementById("userLoansContainer");
const logoutBtn = document.getElementById("logoutBtn");
const bookSearch = document.getElementById("bookSearch");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  if (ADMIN_EMAILS.includes(user.email)) {
    window.location.href = "dashboard-admin.html";
    return;
  }

  await cargarPrestamos(user.uid);
  await cargarLibros(user); 

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      nombreUsuarioActual = data.nombre || "Usuario";
      if(navUserName) navUserName.textContent = data.nombre || "Usuario";
      if(userName) userName.textContent = data.nombre || "Usuario";
      if(profileUserName) profileUserName.textContent = data.nombre || "Usuario";
      if(userEmail) userEmail.textContent = user.email;
    }
  } catch (error) {
    console.error("Error al obtener perfil:", error);
  }
});

async function cargarLibros(user) { 
    if (!booksContainer) return;
    const books = await getBooks();
    booksContainer.innerHTML = "";
    
    if (books.length === 0) {
        booksContainer.innerHTML = "<p class='text-center text-muted'>No hay libros disponibles.</p>";
        return;
    }

    books.forEach((book) => {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-4 book-card"; 
        
        
        const tieneCopias = book.available > 0;
        const botonAtributos = tieneCopias 
            ? `class="btn btn-outline-primary btn-sm loan-btn" data-id="${book.id}"`
            : `class="btn btn-secondary btn-sm" disabled`;
        const botonTexto = tieneCopias ? "Solicitar Préstamo" : "Agotado";

        col.innerHTML = `
            <div class="card h-100 p-3 shadow-sm border-0" style="background: rgba(255,255,255,0.05);">
                <h4 class="text-white h5">${book.title}</h4>
                <p class="mb-1 small text-secondary"><strong>Autor:</strong> ${book.author}</p>
                <p class="mb-1 small"><strong>Disponibles:</strong> ${book.available}</p>
                <div class="d-grid mt-3">
                    <button ${botonAtributos}>${botonTexto}</button>
                </div>
            </div>
        `;

        if (tieneCopias) {
            col.querySelector(".loan-btn").addEventListener("click", async () => {
                const misPrestamos = await getLoansByUser(user.uid);
                if (misPrestamos.some(l => l.bookId === book.id && l.status === "active")) {
                    alert("Ya tienes este libro."); return;
                }
                const nuevaDisponibilidad = book.available - 1;
                await updateBook(book.id, { available: nuevaDisponibilidad });
                await createLoan(book, user); 
                
              const templateParams = {
                user_name: nombreUsuarioActual, 
                user_email: user.email,
                book_title: book.title,
                due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                admin_email: "smartlibrary.soporte@gmail.com" 
              };
              
              emailjs.send('service_xmophh6', 'template_zv2uopy', templateParams)
               .then(() => console.log("Correo enviado con éxito"))
               .catch((error) => console.error("Error al enviar correo:", error));

                await cargarPrestamos(user.uid);
                await cargarLibros(user); 
            });
        }
        booksContainer.appendChild(col);
    });
}

async function cargarPrestamos(uid) {
    if (!userLoansContainer) return;
    const loans = await getLoansByUser(uid);
    userLoansContainer.innerHTML = "";

    if (loans.length === 0) {
        userLoansContainer.innerHTML = `<div class="col-12"><div class="alert alert-info">No tienes préstamos activos.</div></div>`;
        return;
    }

    loans.forEach((loan) => {
        let estado = loan.status; 
        let badgeClass = "bg-success";
        let textoEstado = estado;

        if (estado === "active") {
            const hoy = new Date();
            const fechaLimite = loan.dueDate?.toDate ? loan.dueDate.toDate() : null;
            if (fechaLimite) {
                const diffDias = Math.ceil((fechaLimite - hoy) / (1000 * 60 * 60 * 24));
                if (diffDias <= 0) { badgeClass = "bg-danger"; textoEstado = "expirado"; }
                else if (diffDias <= 2) { badgeClass = "bg-warning text-dark"; textoEstado = "por vencer"; }
            }
        } else if (estado === "returned") {
            badgeClass = "bg-secondary"; textoEstado = "devuelto";
        }

        userLoansContainer.innerHTML += `
            <div class="col-md-4 col-lg-3 mb-3">
                <div class="card h-100 shadow-sm border-0" style="background: rgba(255,255,255,0.05);">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="fw-bold text-white mb-0">${loan.bookTitle || loan.bookTtile || "Libro"}</h6>
                            <span class="badge ${badgeClass} small">${textoEstado}</span>
                        </div>
                        <p class="small text-secondary mb-1">Límite: ${loan.dueDate?.toDate ? loan.dueDate.toDate().toLocaleDateString() : "-"}</p>
                        ${estado === "active" ? `<button class="btn btn-warning btn-sm w-100 mt-2 return-loan-btn" data-id="${loan.id}">Devolver</button>` : ""}
                    </div>
                </div>
            </div>
        `;
    });

    document.querySelectorAll(".return-loan-btn").forEach((btn) => {
        btn.onclick = async () => {
            const loanId = btn.getAttribute("data-id");
            const loanData = loans.find(l => l.id === loanId);
            if (loanData) {
                await returnLoan(loanId);
                const allBooks = await getBooks();
                const bookToUpdate = allBooks.find(b => b.id === loanData.bookId);
                if (bookToUpdate) {
                    await updateBook(bookToUpdate.id, { available: Number(bookToUpdate.available) + 1 });
                }
            }
            await cargarPrestamos(uid);
            if(auth.currentUser) await cargarLibros(auth.currentUser); 
        };
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        await logoutUser();
        window.location.href = "login.html";
    });
}

if (bookSearch) {
    bookSearch.addEventListener("input", (e) => {
        const term = e.target.value.toLowerCase().trim();
        const cards = document.querySelectorAll(".book-card");
        
        cards.forEach(card => {
            const text = card.innerText.toLowerCase();
            if (term === "" || text.includes(term)) {
                card.classList.remove("d-none");
            } else {
                card.classList.add("d-none");
            }
        });
    });
}