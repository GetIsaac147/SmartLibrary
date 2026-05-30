import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const LoanCollectionRef = collection(db, "loans");

export async function createLoan(loan) {
    try {

        await addDoc(LoanCollectionRef, {
            bookId: loan.bookId,
            lectorId: loan.lectorId,

            loanDate: new Date(),

            // 15 días después
            dueDate: new Date(
                Date.now() + (15 * 24 * 60 * 60 * 1000)
            ),

            returnDate: null,

            status: "active",

            createdAt: new Date(),
            updatedAt: new Date()
        });

        alert("Préstamo realizado");

    } catch (error) {

        console.error("Error al realizar préstamo:", error);
        alert("Error al realizar préstamo");
    }
}

export async function getLoans() {
    try {

        const querySnapshot = await getDocs(LoanCollectionRef);

        const loans = [];

        querySnapshot.forEach((documento) => {

            loans.push({
                id: documento.id,
                ...documento.data()
            });

        });

        return loans;

    } catch (error) {

        console.error("Error al obtener préstamos:", error);
        alert("Error al obtener préstamos");

        return [];
    }
}

export async function getUserLoans(userId) {
    try {

        const q = query(
            LoanCollectionRef,
            where("lectorId", "==", userId)
        );

        const querySnapshot = await getDocs(q);

        const loans = [];

        querySnapshot.forEach((documento) => {

            loans.push({
                id: documento.id,
                ...documento.data()
            });

        });

        return loans;

    } catch (error) {

        console.error("Error al obtener préstamos del usuario:", error);
        return [];
    }
}

export async function deleteLoan(loanId) {
    try {

        await deleteDoc(
            doc(db, "loans", loanId)
        );

        alert("Préstamo eliminado");

    } catch (error) {

        console.error("Error al eliminar préstamo:", error);
        alert("Error al eliminar préstamo");
    }
}