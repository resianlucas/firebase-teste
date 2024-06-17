import { db } from '/public/script.js';
import { ref, get, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

let productCounters = {};

document.addEventListener('DOMContentLoaded', () => {
    const searchEanButton = document.getElementById('search-ean-button');
    const eanBar = document.getElementById('ean-bar');

    searchEanButton.addEventListener('click', searchProductByEan);
    eanBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchProductByEan();
        }
    });
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
    document.getElementById('last-scanned').value = product.name;
    document.getElementById('quantity').value = productCounters[product.sku] || 0;
    document.getElementById('price').value = product.price;

    const scannedProducts = document.getElementById('scanned-products');
    const productList = scannedProducts.value ? scannedProducts.value.split('\n') : [];
    productList.push(product.name);
    scannedProducts.value = productList.join('\n');
}

function incrementProductCounter(sku) {
    console.log(`Incrementando contador para SKU: ${sku}`);
    if (!productCounters[sku]) {
        productCounters[sku] = 0;
    }
    productCounters[sku]++;
    document.getElementById('quantity').value = productCounters[sku];
    console.log(`Novo contador para SKU ${sku}: ${productCounters[sku]}`);
}
