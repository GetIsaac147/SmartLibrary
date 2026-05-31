import { db } from "./firebase.js"
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"

const loanCollectionRef = collection(db, "loans")

export async function createLoan(book, user) {
    try {
        await addDoc(loanCollectionRef, {
            bookId : book.id,
            bookTtile: book.title,
            lectorId: user.uid,
            lectorEmail: user.email, 
            loanDate : new Date(),
            dueDate : new Date(
                Date.now()+7*24*60*60*1000
            ),
            returnDate : null,
            status: "active", 
            createdAt: new Date(),
            updatedAt: new Date()
        });
        alert("Prestamo realizado")
    } catch (error) {
        console.error(error)
        alert("Error al realizar prestamo")
    }
}

export async function getLoans() {
    try {
        const querySnapshot = await getDocs(loanCollectionRef)
        const loans = []
        querySnapshot.forEach((docSnap) => {
            loans.push({ 
                id: docSnap.id, 
                ...docSnap.data() 
            })
        })
        return loans
    } catch (error) {
        console.error(error)
        alert("Error al obtener los prestamos")
        return []
    }
}

export async function getLoansByUser(uid) {
    try{
        const q = query(
            loanCollectionRef,
            where("lectorId", "==", uid)
        )
        const querySnapshot = await getDocs(q)
        const loans = []
        querySnapshot.forEach((docSnap) => {
            loans.push({
                id: docSnap.id,
                ...docSnap.data()
            })
        })
        return loans
    } catch (error) {
        console.error(error)
        return []
    }
}

export async function returnLoan(loanId) {
    try {
        const loanRef = doc(db, "loans", loanId)
        await updateDoc(loanRef, {
            status: "returned",
            returnDate: new Date(),
            updatedAt: new Date()
        })
        alert("Libro devuelto")
    } catch (error) {
        alert("Error al devolver el libro")
    }
}

export async function cancelLoan(loanId) {
    try {
        const loanRef = doc(db, "loans", loanId)
        await updateDoc(loanRef, {
            status: cancelled,
            updatedAt: new Date()
        })
        alert("Libro eliminado")
    } catch (error) {
        console.error(error)
        alert("Error al cancelar el prestamo")
    }
}