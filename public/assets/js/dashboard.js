import { createBook, getBooks } from "./books"

const form = document.getElementById("bookForm")

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const title = document.getElementById("title").value
    const isbn = document.getElementById("isbn").value
    const author = document.getElementById("author").value
    const category = document.getElementById("category").value
    const totalCopies = parseInt(document.getElementById("totalCopies").value)
    const available = parseInt(document.getElementById("available").value)

    const book = {
        title: document.getElementById("title").value,
        isbn: document.getElementById("isbn").value,
        author: document.getElementById("author").value,
        category: document.getElementById("category").value,
        totalCopies: parseInt(document.getElementById("totalCopies").value),
        available: parseInt(document.getElementById("available").value)
    }

    await createBook(book)
})

async function loadBooks() {
    const books = await getBooks()
    const container = document.getElementById("booksContainer")
    container.innerHTML = ""
    books.forEach((book) => {
        container.innerHTML += `
        <div class="book-card">
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <button class="delete-btn" data-id="${book.id}">Eliminar</button>
        </div>`
    })
}