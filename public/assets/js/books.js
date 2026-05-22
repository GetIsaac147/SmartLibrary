import { db } from "./firebase.js"
import { 
    collection, 
    getDocs, 
    addDoc, 
    deleteDoc, 
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"

const booksCollectionRef = collection(db, "books")

export async function createBook(book) {
    try {
        await addDoc(booksCollectionRef, {
            title: book.title,
            isbn: book.isbn,
            author: book.author,
            category: book.category,
            totalCopies: book.totalCopies,
            available: book.available,
            status: "available",
            createdAt: new Date(),
            updatedAt: new Date()
        });
    } catch (error) {
        console.error("Error al agregar el libro: ", error)
        throw error
    }
}

export async function getBooks() {
    try {
        const querySnapshot = await getDocs(booksCollectionRef)
        let books = []
        querySnapshot.forEach((d) => {
            books.push({ 
                id: d.id, 
                ...d.data() 
            })
        })
        return books
    } catch (error) {
        console.error("Error al obtener los libros: ", error)
        throw error
    }
}

export async function updateBook(bookId, data) {
    try {
        await updateDoc(doc(db, "books", bookId), {
            ...data,
            updatedAt: new Date()
        })
    } catch (error) {
        console.error("Error al actualizar el libro: ", error)
        throw error
    }
}

export async function deleteBook(bookId) {
    try {
        await deleteDoc(doc(db, "books", bookId))
    } catch (error) {
        console.error("Error al eliminar el libro: ", error)
        throw error
    }
}