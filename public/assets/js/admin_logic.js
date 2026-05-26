import { auth } from "./firebase.js";
import { 
    createBook, 
    getBooks, 
    deleteBook, 
    updateBook 
} from "./books.js";
import { renderBooksTable } from "./ui.js";

const bookForm = document.getElementById("bookForm");
const editBookForm = document.getElementById("editBookForm");
const booksTableBody = document.getElementById("booksTableBody");
const searchInput = document.getElementById("searchInput");
const editModalEl = document.getElementById('editBookModal');

let allBooks = []; 

auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = "./login.html";
    } else {
    
        init();
    }
});

async function init() {
    await loadBooks();
    setupEventListeners();
}

async function loadBooks() {
    allBooks = await getBooks();
    updateStats(allBooks);
    renderTable(allBooks);
}

function updateStats(books) {
    const total = books.length;
    const outOfStock = books.filter(b => Number(b.available) <= 0).length;
    const available = total - outOfStock;

    document.getElementById("totalBooksCount").innerText = total;
    document.getElementById("outOfStockCount").innerText = outOfStock;
    document.getElementById("availableCount").innerText = available;
}

function renderTable(booksToDisplay) {
    renderBooksTable(booksToDisplay, booksTableBody, handleRemoveBook, handleEditClick);
}

bookForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newBook = {
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        isbn: document.getElementById("isbn").value,
        category: document.getElementById("category").value,
        totalCopies: parseInt(document.getElementById("totalCopies").value),
        available: parseInt(document.getElementById("available").value)
    };
    
    await createBook(newBook);
    bookForm.reset();
    await loadBooks();
});

async function handleRemoveBook(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este libro permanentemente?")) {
        await deleteBook(id);
        await loadBooks();
    }
}

function handleEditClick(book) {
    document.getElementById("editBookId").value = book.id;
    document.getElementById("editTitle").value = book.title;
    document.getElementById("editAuthor").value = book.author;
    document.getElementById("editAvailable").value = book.available;
    
    const modal = new bootstrap.Modal(editModalEl);
    modal.show();
}

editBookForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("editBookId").value;
    const data = {
        title: document.getElementById("editTitle").value,
        author: document.getElementById("editAuthor").value,
        available: parseInt(document.getElementById("editAvailable").value)
    };
    
    const success = await updateBook(id, data);
    if (success) {
        const modalInstance = bootstrap.Modal.getInstance(editModalEl);
        modalInstance.hide();
        await loadBooks();
        alert("Libro actualizado con éxito.");
    }
});

function setupEventListeners() {
    searchInput.addEventListener("input", (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allBooks.filter(book => 
            book.title.toLowerCase().includes(term) || 
            book.author.toLowerCase().includes(term) ||
            book.isbn.toLowerCase().includes(term)
        );
        renderTable(filtered);
    });
}