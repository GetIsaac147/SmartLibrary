import { db } from "./firebase.js"
import { collection, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"

const loanCollectionRef = collection(db, "loans")

export async function createLoan(loan) {
    try {
        await addDoc(loanCollectionRef, {
            bookId: loan.bookId,
            lectorId: loan.lectorId,
            loanDate: new Date(),
            dueDate: loan.dueDate,
            returnDate: null,
            status: "active",
            createdAt: new Date(),
            updatedAt: new Date()
        });

        alert("Préstamo realizado");
    } catch (error) {
        console.error(error);
        alert("Error al realizar préstamo");
    }
}

export async function getLoans() {
    try {
        const querySnapshot = await getDocs(loanCollectionRef)
        let loans = []
        querySnapshot.forEach((doc) => {
            loans.push({ 
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
        await deleteDoc(doc(db, "loans", loanId))
        alert("Prestamo eliminado")
    } catch (error) {
        console.error("Error al eliminar el libro: ", error)
        alert("Error al eliminar el prestamo")
    }
}