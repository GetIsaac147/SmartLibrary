import { auth, db } from "./firebase.js";
import { getBooks } from "./books.js";
import { getUserLoans } from "./loans.js";
import { logoutUser } from "./auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const navUserName = document.getElementById("navUserName");
const userName = document.getElementById("userName");
const profileUserName = document.getElementById("profileUserName");
const userEmail = document.getElementById("userEmail");
const booksContainer = document.getElementById("booksContainer");
const loansContainer = document.getElementById("loansContainer");
const totalLoans = document.getElementById("totalLoans");
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
    
    await cargarPrestamos(user.uid);
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

async function cargarPrestamos() {

    if (!loansContainer) return;

    const loans = await getLoans();

    loansContainer.innerHTML = "";

    if (!loans || loans.length === 0) {

        loansContainer.innerHTML = `
            <div class="card p-4 text-center">
                <i class="bi bi-book fs-1 text-info"></i>
                <h5 class="mt-3">No tienes préstamos registrados</h5>
            </div>
        `;

        if(totalLoans) totalLoans.textContent = "0";
        return;
    }

    if(totalLoans){
        totalLoans.textContent = loans.length;
    }

    loans.forEach((loan)=>{

        const badge =
            loan.status === "returned"
            ? "bg-primary"
            : "bg-success";

        const texto =
            loan.status === "returned"
            ? "Devuelto"
            : "Activo";

        loansContainer.innerHTML += `
            <div class="card p-3 mb-3">

                <div class="d-flex justify-content-between align-items-center">

                    <div>
                        <h5 class="text-white mb-2">
                            ${loan.bookId}
                        </h5>

                        <p class="mb-1">
                            <strong>Préstamo:</strong>
                            ${
                                loan.loanDate?.toDate
                                ? loan.loanDate.toDate().toLocaleDateString()
                                : "-"
                            }
                        </p>

                        <p class="mb-1">
                            <strong>Entrega:</strong>
                            ${
                                loan.dueDate?.toDate
                                ? loan.dueDate.toDate().toLocaleDateString()
                                : "-"
                            }
                        </p>
                    </div>

                    <span class="badge ${badge}">
                        ${texto}
                    </span>

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

if (loansContainer) {
    cargarPrestamos();
}