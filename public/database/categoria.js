import { db } from '../script.js';
import { ref, set, get, child, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export async function getCategory(name) {
    const categoriaRef = ref(db, 'category/' + name);
    const snapshot = await get(categoriaRef);
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        console.log('Categoria não encontrada');
        return null;
    }
}

export async function createCategory(category) {
    const categoriaRef = ref(db, 'category/' + category.name);
    await set(categoriaRef, category);
}

export async function updateProduct(name, updates) {
    const categoriaRef = ref(db, 'category/' + name);
    await update(categoriaRef, updates);
}

export async function getAllProducts() {
    const categorias = [];
    const categoriaRef = ref(db, 'category');
    const snapshot = await get(categoriaRef);
    snapshot.forEach((childSnapshot) => {
        categorias.push(childSnapshot.val());
    });
    return categorias;
}