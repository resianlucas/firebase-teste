import { db } from '/public/script.js';
import { ref, get, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

let productCounters = {};

document.addEventListener('DOMContentLoaded', () => {
    const searchEanButton = document.getElementById('search-ean-button');
    const eanBar = document.getElementById('ean-bar');
    const updateButton = document.getElementById('update-button');

    searchEanButton.addEventListener('click', searchProductByEan);
    eanBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchProductByEan();
        }
    });
    updateButton.addEventListener('click', updateAllQuantities);
});

async function searchProductByEan() {
    const ean = document.getElementById('ean-bar').value.trim();
    console.log(`Procurando produto com EAN: ${ean}`);
    if (!ean) return;

    try {
        const productSnapshot = await getProductByEan(ean);
        if (productSnapshot.exists()) {
            const product = productSnapshot.val();
            console.log(`Produto encontrado:`, product);
            updateProductDetails(product);
            incrementProductCounter(product.sku);
        } else {
            alert('Produto não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
    } finally {
        document.getElementById('ean-bar').value = '';
    }
}

async function getProductByEan(ean) {
    const dbRef = ref(db, 'products');
    const snapshot = await get(dbRef);
    let productSnapshot = null;

    snapshot.forEach(childSnapshot => {
        if (childSnapshot.val().ean === ean) {
            productSnapshot = childSnapshot;
        }
    });

    console.log(`Resultado da busca por EAN ${ean}:`, productSnapshot ? productSnapshot.val() : 'Nenhum produto encontrado');
    return productSnapshot;
}

function updateProductDetails(product) {
    console.log(`Atualizando detalhes do produto:`, product);
    document.getElementById('product-image').src = product.imageUrl || 'placeholder.jpg';
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-quantity-value').textContent = productCounters[product.sku] || 0;
}

function incrementProductCounter(sku) {
    console.log(`Incrementando contador para SKU: ${sku}`);
    if (!productCounters[sku]) {
        productCounters[sku] = 0;
    }
    productCounters[sku]++;
    document.getElementById('product-quantity-value').textContent = productCounters[sku];
    console.log(`Novo contador para SKU ${sku}: ${productCounters[sku]}`);
}

async function updateAllQuantities() {
    const updates = {};

    try {
        for (const sku in productCounters) {
            const declaredQuantity = productCounters[sku];
            const productRef = ref(db, `products/${sku}`);
            const productSnapshot = await get(productRef);

            if (productSnapshot.exists()) {
                const currentQuantity = productSnapshot.val().quantity || 0;
                const newQuantity = currentQuantity + declaredQuantity;
                updates[`/products/${sku}/quantity`] = newQuantity;
            }
        }

        console.log(`Atualizando quantidades no Firebase:`, updates);
        await update(ref(db), updates);
        alert('Quantidades atualizadas com sucesso!');
        console.log('Quantidades atualizadas com sucesso!');
        
        // Resetar os contadores
        productCounters = {};
        document.getElementById('product-quantity-value').textContent = 0;
    } catch (error) {
        console.error('Erro ao atualizar quantidades:', error);
        alert('Erro ao atualizar quantidades.');
    }
}
