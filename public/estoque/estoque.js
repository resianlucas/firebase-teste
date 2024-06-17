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
        console.log('Quantidades atualizadas com sucesso!');
        
        // Mostrar janela pop-up com produtos atualizados
        mostrarJanelaPopup();

        // Resetar os contadores
        productCounters = {};
        document.getElementById('product-quantity-value').textContent = 0;
    } catch (error) {
        console.error('Erro ao atualizar quantidades:', error);
        alert('Erro ao atualizar quantidades.');
    }
}

function mostrarJanelaPopup() {
    let popupWindow = window.open("", "Produtos Atualizados", "width=600,height=400");
    popupWindow.document.write(`
        <html>
            <head>
                <title>Produtos Atualizados</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 20px;
                    }

                    h1 {
                        text-align: center;
                        color: #333;
                    }

                    ul {
                        list-style-type: none;
                        padding: 0;
                    }

                    li {
                        background-color: #fff;
                        margin: 10px 0;
                        padding: 10px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }

                    li:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                </style>
            </head>
            <body>
                <h1>Produtos Atualizados</h1>
                <ul>
                    ${Object.entries(productCounters).map(([sku, quantity]) => `<li>SKU: ${sku}, Quantidade Atualizada: ${quantity}</li>`).join('')}
                </ul>
            </body>
        </html>
    `);
    popupWindow.document.close();
}

