import { db } from "./firebase.js"
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore"

const authorsCollectionRef = collection(db, "authors")

export async function createAuthor(auhtor) {
    try {
        await addDoc(authorCollectionRef, {
            name : author.name,
            lastName : author.lastName,
            createdAt : new Date(),
            updatedAt : new Date()
        });
        alert("Autor agregado")
    } catch (error) {
        console.error("Error al agregar autor: ", error)
        alert("Error al agregar autor")
    }
}

export async function getAuthros() {
    try {
        const querySnapshot = await getDocs(authorCollectionRef)
        let authors = []
        querySnapshot.forEach((doc) => {
            authors.push({ 
                id: doc.id, 
                ...doc.data() 
            })
        })
        return authors
    } catch (error) {
        console.error("Error al obtener autores: ", error)
        alert("Error al obtener los autores")
    }
}

export async function deleteAuthor(authorId) {
    try {
        await deleteDoc(doc(db, "authors", authorId))
        alert("Autor eliminado")
    } catch (error) {
        console.error("Error al eliminar autor: ", error)
        alert("Error al eliminar autor")
    }
}