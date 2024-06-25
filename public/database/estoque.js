import { db } from '../script.js';
import { ref, set, get, child, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export async function getEstoque(sku) {
    const estoqueRef = ref(db, 'products/' + sku);
    const snapshot = await get(estoqueRef);
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        console.log('Produto não encontrado');
        return null;
    }
}

export async function updateEstoque(sku, quantidade) {
    const updates = {};
    const estoqueRef = ref(db, '/products' + sku)
    const snapshot = await get(estoqueRef)
    if (snapshot.exists()) {
        const currentQuantity = snapshot.val().quantity || 0;
        const newQuantity = currentQuantity + quantidade;
        if (newQuantity < 0) {
            alert(`Quantidade negativa não permitida para SKU: ${sku}`);
        }
        updates[`/products/${sku}/quantity`] = newQuantity;
    } else {
        alert(`Produto com SKU: ${sku} não encontrado.`);
    }
    console.log(`Atualizando quantidades no Firebase:`, updates);
    await update(ref(db), updates);

    
}
