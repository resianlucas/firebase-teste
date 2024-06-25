import { db } from '../script.js';
import { ref, set, get, child, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export async function getNewBling() {

}

export async function createBling(bling) {
    const blingRef = ref(db, '/bling' + bling.client_id);
    const bling = set(blingRef, bling)
    return true;
}

export async function updateBling() {
    
}