import { observarSesion, logoutUser } from "./auth.js";
import { createBook, getBooks, updateBook, deleteBook } from "./books.js";

const userName      = document.getElementById("userName");
const navUserName   = document.getElementById("navUserName");
const userEmail     = document.getElementById("userEmail");
const totalBooks    = document.getElementById("totalBooks");
const logoutBtn     = document.getElementById("logoutBtn");

const booksLoading  = document.getElementById("booksLoading");
const booksEmpty    = document.getElementById("booksEmpty");
const booksTable = document.getElementById("booksTableWrap");
const booksTbody    = document.getElementById("booksTbody");
const booksAlert    = document.getElementById("booksAlert");
const booksSuccess  = document.getElementById("booksSuccess");

const addBookForm   = document.getElementById("addBookForm");
const addBookBtn    = document.getElementById("addBookBtn");
const addBookAlert  = document.getElementById("addBookAlert");
const addTitle      = document.getElementById("addTitle");
const addAuthor     = document.getElementById("addAuthor");
const addIsbn        = document.getElementById("addIsbn");
const addCategory    = document.getElementById("addCategory");
const addTotalCopies = document.getElementById("addTotalCopies");
const addAvailable   = document.getElementById("addAvailable");

const editBookForm  = document.getElementById("editBookForm");
const editBookBtn   = document.getElementById("editBookBtn");
const editBookAlert = document.getElementById("editBookAlert");
const editBookId    = document.getElementById("editBookId");
const editTitle     = document.getElementById("editTitle");
const editAuthor    = document.getElementById("editAuthor");
const editGenre     = document.getElementById("editGenre");
const editYear      = document.getElementById("editYear");

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

  booksTbody.innerHTML = books.map((book, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.category || "—"}</td>
      <td>${book.totalCopies || 0}</td>
      <td>${book.available || 0}</td>
      <td>
        <button class="btn btn-sm btn-primary"
          onclick="openEditModal('${book.id}','${book.title}','${book.author}','${book.category}','${book.totalCopies}')">
          Editar
        </button>
        <button class="btn btn-sm btn-danger"
          onclick="openDeleteModal('${book.id}','${book.title}')">
          Eliminar
        </button>
      </td>
    </tr>
  `).join("");
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

window.openEditModal = (id, title, author, category, total) => {
  editBookId.value = id;
  editTitle.value = title;
  editAuthor.value = author;
  editGenre.value = category;
  editYear.value = total;
  editModal.show();
};

editBookForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = editBookId.value;

  try {
    await updateBook(id, {
      title: editTitle.value,
      author: editAuthor.value,
      category: editGenre.value,
      totalCopies: Number(editYear.value),
      available: Number(editYear.value)
    });

    editModal.hide();
    await loadBooks();
  } catch (err) {
    showAlert(editBookAlert, "Error al actualizar");
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

observarSesion(async (user) => {
  if (!user) {
    window.location.href = "./login.html";
    return;
  }

  const displayName = user.displayName || user.email;

  userName.textContent = displayName;
  navUserName.textContent = displayName;
  userEmail.textContent = user.email;

  await loadBooks();
});