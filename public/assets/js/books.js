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
            title : book.title,
            isbn : book.isbn,
            author : book.author,
            category : book.category,
            totalCopies : book.totalCopies,
            available : book.available,
            status: "available", 
            createdAt: new Date(),
            updatedAt: new Date()
        });
        alert("Libro agregado")
    } catch (error) {
        console.error("Error al agregar el libro: ", error)
        alert("Error al agregar el libro")
    }
}

export async function getBooks() {
    try {
        const querySnapshot = await getDocs(booksCollectionRef)
        let books = []
        querySnapshot.forEach((doc) => {
            books.push({ 
                id: doc.id, 
                ...doc.data() 
            })
        })
        return books
    } catch (error) {
        console.error("Error al obtener los libros: ", error)
        alert("Error al obtener los libros")
    }
}

export async function deleteBook(bookId) {
    try {
        await deleteDoc(doc(db, "books", bookId))
        alert("Libro eliminado")
    } catch (error) {
        console.error("Error al eliminar el libro: ", error)
        alert("Error al eliminar el libro")
    }
}

export async function updateBook(bookId, updatedData) {
    try {
        const bookRef = doc(db, "books", bookId);
        await updateDoc(bookRef, {
            ...updatedData,
            updatedAt: new Date()
        });
        return true;
    } catch (error) {
        console.error("Error al actualizar:", error);
        return false;
    }
}