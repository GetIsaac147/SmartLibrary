import { auth, db } from "./firebase.js";
import { getBooks } from "./books.js";
import { getLoansByUser, returnLoan } from "./loans.js";
import { logoutUser, ADMIN_EMAILS } from "./auth.js"; 
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const navUserName = document.getElementById("navUserName");
const userName = document.getElementById("userName");
const profileUserName = document.getElementById("profileUserName");
const userEmail = document.getElementById("userEmail");
const booksContainer = document.getElementById("booksContainer");
const loanContent = document.getElementById("loansContainer");
const userLoansContainer = document.getElementById("userLoansContainer");
const logoutBtn = document.getElementById("logoutBtn");

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

async function cargarPrestamos(uid) {
  const loanContent = document.getElementById("loanContent");

  if (loanContent) {
  loanContent.classList.remove("d-none");
  }

  if (!userLoansContainer) return;

  const loans = await getLoansByUser(uid);

  userLoansContainer.innerHTML = "";

  if (loans.length === 0) {

    userLoansContainer.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info">
          No tienes préstamos activos.
        </div>
      </div>
    `;

    return;
  }

  loans.forEach((loan) => {

    let estado = loan.status;

    if (
      estado === "active" &&
      loan.dueDate?.toDate &&
      loan.dueDate.toDate() < new Date()
    ) {
      estado = "expired";
    }

    let badgeClass = "bg-success";

    if (estado === "returned")
      badgeClass = "bg-secondary";

    if (estado === "expired")
      badgeClass = "bg-danger";

    userLoansContainer.innerHTML += `
      <div class="col-md-6">

        <div class="card h-100 shadow-sm">

          <div class="card-body">

            <div class="d-flex justify-content-between">

              <h5>${loan.bookTitle}</h5>

              <span class="badge ${badgeClass}">
                ${estado}
              </span>

            </div>

            <p class="mb-2">
              <strong>Fecha préstamo:</strong><br>
              ${
                loan.loanDate?.toDate
                  ? loan.loanDate.toDate().toLocaleDateString()
                  : "-"
              }
            </p>

            <p>
              <strong>Fecha límite:</strong><br>
              ${
                loan.dueDate?.toDate
                  ? loan.dueDate.toDate().toLocaleDateString()
                  : "-"
              }
            </p>

            ${
              estado === "active"
                ? `
                  <button
                    class="btn btn-warning btn-sm return-loan-btn"
                    data-id="${loan.id}">
                    Devolver libro
                  </button>
                `
                : ""
            }

          </div>

        </div>

      </div>
    `;
  });

  document
    .querySelectorAll(".return-loan-btn")
    .forEach((btn) => {

      btn.addEventListener("click", async () => {

        const loanId =
          btn.getAttribute("data-id");

        await returnLoan(loanId);

        await cargarPrestamos(uid);
      });

    });
}

if (booksContainer) {
    cargarLibros();
}

