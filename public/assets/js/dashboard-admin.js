import { observarSesion, logoutUser } from "./auth.js";
import { createBook, getBooks, updateBook, deleteBook } from "./books.js";

const userName      = document.getElementById("userName");
const navUserName   = document.getElementById("navUserName");
const userEmail     = document.getElementById("userEmail");
const totalBooks    = document.getElementById("totalBooks");
const logoutBtn     = document.getElementById("logoutBtn");

const booksLoading  = document.getElementById("booksLoading");
const booksEmpty    = document.getElementById("booksEmpty");
const booksTable    = document.getElementById("booksTableWrap");
const booksTbody    = document.getElementById("booksTbody");
const booksAlert    = document.getElementById("booksAlert");
const booksSuccess  = document.getElementById("booksSuccess");

const addBookForm    = document.getElementById("addBookForm");
const addBookBtn     = document.getElementById("addBookBtn");
const addBookAlert   = document.getElementById("addBookAlert");
const addTitle       = document.getElementById("addTitle");
const addAuthor      = document.getElementById("addAuthor");
const addIsbn        = document.getElementById("addIsbn");
const addCategory    = document.getElementById("addCategory");
const addTotalCopies = document.getElementById("addTotalCopies");
const addAvailable   = document.getElementById("addAvailable");

const editBookForm    = document.getElementById("editBookForm");
const editBookBtn     = document.getElementById("editBookBtn");
const editBookAlert   = document.getElementById("editBookAlert");
const editBookId      = document.getElementById("editBookId");
const editTitle       = document.getElementById("editTitle");
const editAuthor      = document.getElementById("editAuthor");
const editIsbn        = document.getElementById("editIsbn");
const editCategory    = document.getElementById("editCategory");
const editTotalCopies = document.getElementById("editTotalCopies");
const editAvailable   = document.getElementById("editAvailable");

const deleteBookId    = document.getElementById("deleteBookId");
const deleteBookTitle = document.getElementById("deleteBookTitle");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

const addModal  = bootstrap.Modal.getOrCreateInstance(document.getElementById("addBookModal"));
const editModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("editBookModal"));
const delModal  = bootstrap.Modal.getOrCreateInstance(document.getElementById("deleteBookModal"));

function showEl(el)  { el?.classList.remove("d-none"); }
function hideEl(el)  { el?.classList.add("d-none"); }

function showAlert(el, msg) {
  if (!el) return;
  el.textContent = msg;
  showEl(el);
}
function hideAlertEl(el) {
  if (!el) return;
  el.textContent = "";
  hideEl(el);
}

function setLoading(btn, isLoading, originalHTML) {
  btn.disabled = isLoading;
  btn.innerHTML = isLoading
    ? `<span class="spinner-border spinner-border-sm me-2"></span>Procesando...`
    : originalHTML;
}

function renderBooks(books) {
  hideEl(booksLoading);

  if (!books.length) {
    hideEl(booksTable);
    showEl(booksEmpty);
    totalBooks.textContent = "0";
    return;
  }

  showEl(booksTable);
  hideEl(booksEmpty);
  totalBooks.textContent = books.length;

  const safe = (v) => String(v ?? "").replace(/'/g, "\\'");

  booksTbody.innerHTML = books.map((book, i) => {
    const available = book.available ?? 0;
    const statusBadge = available > 0
      ? `<span class="status-available">Disponible</span>`
      : `<span class="status-unavailable">Sin copias</span>`;

    return `
      <tr>
        <td>${i + 1}</td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn || "—"}</td>
        <td><span class="category-badge">${book.category || "—"}</span></td>
        <td>${book.totalCopies || 0}</td>
        <td>${available}</td>
        <td>${statusBadge}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-primary action-btn me-1"
            title="Editar"
            onclick="openEditModal(
              '${safe(book.id)}',
              '${safe(book.title)}',
              '${safe(book.author)}',
              '${safe(book.isbn)}',
              '${safe(book.category)}',
              '${safe(book.totalCopies)}',
              '${safe(book.available)}'
            )">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-danger action-btn"
            title="Eliminar"
            onclick="openDeleteModal('${safe(book.id)}','${safe(book.title)}')">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

async function loadBooks() {
  showEl(booksLoading);
  try {
    const books = await getBooks();
    renderBooks(books);
  } catch (err) {
    showAlert(booksAlert, "Error al cargar libros");
  }
}

addBookForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title  = addTitle.value.trim();
  const author = addAuthor.value.trim();

  if (!title || !author) {
    showAlert(addBookAlert, "Completa los campos obligatorios");
    return;
  }

  const original = addBookBtn.innerHTML;
  setLoading(addBookBtn, true, original);

  try {
    await createBook({
      title,
      author,
      isbn: addIsbn.value,
      category: addCategory.value,
      totalCopies: Number(addTotalCopies.value),
      available: Number(addAvailable.value)
    });

    addBookForm.reset();
    addModal.hide();
    await loadBooks();
  } catch (err) {
    showAlert(addBookAlert, "Error al agregar libro");
  } finally {
    setLoading(addBookBtn, false, original);
  }
});

window.openEditModal = (id, title, author, isbn, category, total, available) => {
  editBookId.value       = id;
  editTitle.value        = title;
  editAuthor.value       = author;
  editIsbn.value         = isbn;
  editCategory.value     = category;
  editTotalCopies.value  = total;
  editAvailable.value    = available;
  editModal.show();
};

editBookForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = editBookId.value;
  const original = editBookBtn.innerHTML;
  setLoading(editBookBtn, true, original);

  try {
    await updateBook(id, {
      title:       editTitle.value.trim(),
      author:      editAuthor.value.trim(),
      isbn:        editIsbn.value.trim(),
      category:    editCategory.value.trim(),
      totalCopies: Number(editTotalCopies.value),
      available:   Number(editAvailable.value)
    });

    editModal.hide();
    await loadBooks();
  } catch (err) {
    showAlert(editBookAlert, "Error al actualizar");
  } finally {
    setLoading(editBookBtn, false, original);
  }
});

window.openDeleteModal = (id, title) => {
  deleteBookId.value = id;
  deleteBookTitle.textContent = title;
  delModal.show();
};

confirmDeleteBtn?.addEventListener("click", async () => {
  try {
    await deleteBook(deleteBookId.value);
    delModal.hide();
    await loadBooks();
  } catch (err) {
    showAlert(booksAlert, "Error al eliminar");
  }
});

logoutBtn?.addEventListener("click", async () => {
  await logoutUser();
  window.location.href = "./login.html";
});

import { ADMIN_EMAIL } from "./auth.js";

observarSesion(async (user) => {
  if (!user) {
    window.location.href = "./login.html";
    return;
  }

  if (user.email !== ADMIN_EMAIL) {
    alert("No tienes permisos de administrador");
    window.location.href = "./login.html";
    return;
  }

  const displayName = user.displayName || user.email;

  userName.textContent    = displayName;
  navUserName.textContent = displayName;
  userEmail.textContent   = user.email;

  await loadBooks();
});