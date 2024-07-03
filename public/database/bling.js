import { db } from '../script.js';
import { ref, set, get, child, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export async function getNewBling(idLoja) {
    const blingRef = ref(db, 'bling/');
    if (idLoja) {
        idLoja = String(idLoja);
        console.log('ID Loja: ', idLoja)
        const snapshot = await get(child(blingRef, idLoja))
        return [snapshot.val()]
    } else {
        console.log('Não possui idLoja')
        const snapshot = await get(blingRef)
        return snapshot.val()
    }
}

export async function createBling(bling) {
    const blingRef = ref(db, '/bling' + bling.client_id);
    const newBling = set(blingRef, bling)
    console.log(newBling)
    return true;
}

export async function updateBling() {

}