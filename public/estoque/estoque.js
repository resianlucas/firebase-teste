import { db } from '/public/script.js';
import { ref, get, update, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { updateEstoque } from '../database/estoque.js';
import Estoque from '../classes/Estoque.js';

let productCounters = {};

document.addEventListener('DOMContentLoaded', () => {
    const searchEanButton = document.getElementById('search-ean-button');
    const eanBar = document.getElementById('ean-bar');
    const updateButton = document.getElementById('update-button');
    const deleteButton = document.getElementById('delete-button');
    const loadXmlButton = document.getElementById('load-xml-button');
    const xmlFileInput = document.getElementById('xml-file-input');

    searchEanButton.addEventListener('click', searchProductByEan);
    eanBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchProductByEan()
        }
    });
    updateButton.addEventListener('click', updateAllQuantities);
    deleteButton.addEventListener('click', deleteScannedQuantities);
    loadXmlButton.addEventListener('click', loadXml);
});

async function cadastrar(ean) {
    const quantidade = productCounters[ean] || 0;
    const produtosRef = ref(db, `cadastrar/${ean}`);
    await set(produtosRef, { ean, quantity: quantidade });
    novoCadastro(ean);
    incrementProductCounter(ean);
}

async function searchProductByEan() {
    const ean = document.getElementById('ean-bar').value.trim();
    console.log(`Procurando produto com EAN: ${ean}`);
    if (!ean) {
        return alert("EAN não pode ser vazio");
    }

    try {
        const productSnapshot = await getProductByEan(ean);
        if (productSnapshot) {
            const product = productSnapshot.val();
            console.log(`Produto encontrado:`, product);
            updateProductDetails(product);
            incrementProductCounter(product.sku);
            console.log(`Produto encontrado:${product.sku}`)
        } else {
            await cadastrar(ean);
            alert('Produto não encontrado. Cadastrado na tabela "cadastrar".');
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

function novoCadastro(ean) {
    document.getElementById('product-image').src = 'placeholder.jpg';
    document.getElementById('product-name').textContent = ean;
    document.getElementById('product-quantity-value').textContent = productCounters[ean] || 0;
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
    try {
        for (const sku in productCounters) {
            const declaredQuantity = productCounters[sku];
            await updateEstoque(sku, declaredQuantity);
        }

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

async function deleteScannedQuantities() {
    const updates = {};

    try {
        for (const sku in productCounters) {
            const declaredQuantity = productCounters[sku];
            const productRef = ref(db, `products/${sku}`);
            const productSnapshot = await get(productRef);

            if (productSnapshot.exists()) {
                const currentQuantity = productSnapshot.val().quantity || 0;
                const newQuantity = currentQuantity - declaredQuantity;
                if (newQuantity < 0) {
                    alert(`Quantidade negativa não permitida para SKU: ${sku}`);
                    continue;
                }
                updates[`/products/${sku}/quantity`] = newQuantity;
            } else {
                alert(`Produto com SKU: ${sku} não encontrado para deletar.`);
            }
        }

        console.log(`Atualizando quantidades no Firebase:`, updates);
        await update(ref(db), updates);
        console.log('Quantidades deletadas com sucesso!');

        // Mostrar janela pop-up com produtos atualizados
        mostrarJanelaPopup(true);

        // Resetar os contadores
        productCounters = {};
        document.getElementById('product-quantity-value').textContent = 0;
    } catch (error) {
        console.error('Erro ao deletar quantidades:', error);
        alert('Erro ao deletar quantidades.');
    }
}

function mostrarJanelaPopup(isDeletion = false) {
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
                <h1>${isDeletion ? 'Produtos Deletados' : 'Produtos Atualizados'}</h1>
                <ul>
                    ${Object.entries(productCounters).map(([sku, quantity]) => `<li>SKU: ${sku}, Quantidade ${isDeletion ? 'Deletada' : 'Atualizada'}: ${quantity}</li>`).join('')}
                </ul>
            </body>
        </html>
    `);
    popupWindow.document.close();
}

function loadXml() {
    const xmlFileInput = document.getElementById('xml-file-input');
    const file = xmlFileInput.files[0];

    if (!file) {
        alert('Por favor, selecione um arquivo XML.');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function (e) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(e.target.result, "application/xml");

        const produtos = xmlDoc.getElementsByTagName("det");

        for (let i = 0; i < produtos.length; i++) {
            const produto = produtos[i];
            const ean = produto.getElementsByTagName("cEAN")[0].textContent;
            const quantidade = parseInt(produto.getElementsByTagName("qCom")[0].textContent, 10);
            const price = parseFloat(produto.getElementsByTagName('vUnCom')[0].textContent);
            const p = parseFloat((price * 1.5).toFixed(2));
            const newPrice = Math.ceil(p * 20) / 20;


            if (!productCounters[ean]) {
                productCounters[ean] = 0;
            }
            productCounters[ean] += quantidade;

            const productSnapshot = await getProductByEan(ean);

            if (productSnapshot) {
                const product = productSnapshot.val();
                console.log(`Produto: ${product.sku}`);
                
                const currentQuantity = product.quantity || 0;
                
                const newQuantity = currentQuantity; //+ quantidade;
                console.log(`Nova Quantidade: ${newQuantity}`);
                console.log(`Preço: ${newPrice}`);

                if (typeof newQuantity !== "number") {
                    console.error("A nova quantidade não é um número válido.");
                    await set(ref(db, `products/${product.sku}/quantity`), 0);

                } else {
                    await set(ref(db, `products/${product.sku}/quantity`), newQuantity);
                    await set(ref(db, `products/${product.sku}/price`), newPrice);
                }

                
                  
                // Atualizando a quantidade do produto
                await set(ref(db, `products/${product.sku}/quantity`), newQuantity);
            } else {
                await set(ref(db, `cadastrar/${ean}`), {
                    ean: ean,
                    quantity: quantidade,
                    price: newPrice,
                    sku: produto.getElementsByTagName("cProd")[0].textContent,
                    name: produto.getElementsByTagName("xProd")[0].textContent
                });
            }
        }

        alert('Estoque atualizado a partir do XML.');
    };

    reader.readAsText(file);
}
