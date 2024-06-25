import { db } from '../script.js';
import { ref, set, get, child, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export async function getNewBling(idLoja) {
    const blingRef = ref(db, 'bling/');
    if (idLoja) {
        const bling = await get(child(blingRef, idLoja))
        return bling
    } else {
        const bling = await get(blingRef)
        return bling
    }
}

export async function createBling(bling) {
    const blingRef = ref(db, '/bling' + bling.client_id);
    const bling = set(blingRef, bling)
    return true;
}

export async function updateBling() {

}