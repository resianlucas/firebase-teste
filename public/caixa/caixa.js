import { db } from '/public/script.js';
import { ref, get, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

let productCounters = {};
let products = {};

document.addEventListener('DOMContentLoaded', () => {
    const eanBar = document.getElementById('ean-bar');
    const searchEanButton = document.getElementById('search-ean-button');

    searchEanButton.addEventListener('click', searchProductByEan);
    eanBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchProductByEan();
        }
    });
});

async function searchProductByEan() {
    const ean = document.getElementById('ean-bar').value.trim();
    if (!ean) return;

    try {
        const productSnapshot = await getProductByEan(ean);
        if (productSnapshot.exists()) {
            const product = productSnapshot.val();
            products[product.sku] = product; // Adiciona o produto ao objeto products
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

    return productSnapshot;
}

function updateProductDetails(product) {
    document.getElementById('product-image').src = product.imageUrl || 'placeholder.jpg';
    document.getElementById('last-scanned').textContent = product.name;
    document.getElementById('quantity').textContent = `Quantidade: ${productCounters[product.sku] || 0}`;
    document.getElementById('price').textContent = `Preço: ${product.price}`;

    const scannedProducts = document.getElementById('scanned-products');
    scannedProducts.value += `${product.name}\n`;
}

function incrementProductCounter(sku) {
    if (!productCounters[sku]) {
        productCounters[sku] = 0;
    }
    productCounters[sku]++;
    document.getElementById('quantity').textContent = `Quantidade: ${productCounters[sku]}`;

    const totalItems = Object.values(productCounters).reduce((a, b) => a + b, 0);
    document.getElementById('total-items').textContent = totalItems;

    const subtotal = Object.entries(productCounters).reduce((total, [key, value]) => {
        const product = products[key];
        return total + (product.price * value);
    }, 0);
    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
}
