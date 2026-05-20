import { db } from "./firebase.js"
import { collection, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"

const LoanCollectionRef = collection(db, "loans")

export async function createLoan(loan) {
    try {
        await addDoc(loanCollectionRef, {
            bookId : book.id,
            lectorId : lector.id,
            loanDate : new Date(),
            dueDate : new Date(),
            returnDate : new Date(),
            status: "available", 
            createdAt: new Date(),
            updatedAt: new Date()
        });
        alert("Prestamo realizado")
    } catch (error) {
        console.error("Error al realizar prestamo", error)
        alert("Error al realizar prestamo")
    }
}

export async function getLoans() {
    try {
        const querySnapshot = await getDocs(loanCollectionRef)
        let loans = []
        querySnapshot.forEach((doc) => {
            books.push({ 
                id: doc.id, 
                ...doc.data() 
            })
        })
        return loans
    } catch (error) {
        console.error("Error al obtener los prestamos: ", error)
        alert("Error al obtener los prestamos")
    }
}

export async function deleteLoan(loanId) {
    try {
        await deleteDoc(doc(db, "books", bookId))
        alert("Libro eliminado")
    } catch (error) {
        console.error("Error al eliminar el libro: ", error)
        alert("Error al eliminar el libro")
    }
}