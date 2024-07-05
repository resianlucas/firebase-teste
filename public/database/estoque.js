import { db } from '../script.js';
import { ref, set, get, child, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export async function getEstoqu(sku) {
    const estoqueRef = ref(db, 'products/' + sku);
    const snapshot = await get(estoqueRef);
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        console.log('Produto não encontrado');
        return null;
    }
}

export async function createEstoque(sku, quantidade) {
    console.log('função ativa');
    console.log(`quantidade: ${quantidade}, tipo: ${typeof quantidade}`);
    const updates = {};
    const estoqueRef = ref(db, `/products/${sku}`);
    console.log('referência de estoque:', estoqueRef);

    try {
        const snapshot = await get(estoqueRef);
        console.log('snapshot:', snapshot);

        if (snapshot.exists()) {
            const quantidadeInt = parseInt(quantidade, 10);
            const newQuantity = quantidadeInt;
            console.log(`nova quantidade: ${newQuantity}, tipo: ${typeof newQuantity}`);

            if (newQuantity < 0) {
                console.error(`Quantidade negativa não permitida para SKU: ${sku}`);
                return; // Interrompe a execução da função se a quantidade for negativa
            }

            updates[`/products/${sku}/quantity`] = newQuantity;
        } else {
            console.error(`Produto com SKU: ${sku} não encontrado.`);
            return; // Interrompe a execução da função se o produto não for encontrado
        }

        console.log(`Atualizando quantidades no Firebase:`, updates);
        await update(ref(db), updates);
        console.log('Quantidade atualizada com sucesso.');
    } catch (error) {
        console.error('Erro ao atualizar quantidade no Firebase:', error);
    }
}

export async function updateEstoque(sku, quantidade) {
    console.log('função ativa');
    console.log(`quantidade: ${quantidade}, tipo: ${typeof quantidade}`);
    const updates = {};
    const estoqueRef = ref(db, `/products/${sku}`);
    console.log('referência de estoque:', estoqueRef);

    try {
        const snapshot = await get(estoqueRef);
        console.log('snapshot:', snapshot);

        if (snapshot.exists()) {
            const currentQuantity = parseInt(snapshot.val().quantity, 10) || 0;
            const quantidadeInt = parseInt(quantidade, 10);

            const newQuantity = currentQuantity + quantidadeInt;
            console.log(`nova quantidade: ${newQuantity}, tipo: ${typeof newQuantity}`);

            if (newQuantity < 0) {
                console.error(`Quantidade negativa não permitida para SKU: ${sku}`);
                return; // Interrompe a execução da função se a quantidade for negativa
            }

            updates[`/products/${sku}/quantity`] = newQuantity;
        } else {
            console.error(`Produto com SKU: ${sku} não encontrado.`);
            return; // Interrompe a execução da função se o produto não for encontrado
        }

        console.log(`Atualizando quantidades no Firebase:`, updates);
        await update(ref(db), updates);
        console.log('Quantidade atualizada com sucesso.');
    } catch (error) {
        console.error('Erro ao atualizar quantidade no Firebase:', error);
    }
}

export async function verificarEstoque(sku, quantidadeSolicitada) {
    const productRef = ref(db, `products/${sku}`);
    const productSnapshot = await get(productRef);

    if (productSnapshot.exists()) {
        const quantidadeAtual = productSnapshot.val().quantity || 0;
        const novaQuantidade = quantidadeAtual - quantidadeSolicitada;
        return novaQuantidade >= 0;
    } else {
        console.error(`Produto com SKU: ${sku} não encontrado.`);
        return false;
    }
}

