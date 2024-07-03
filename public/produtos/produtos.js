import { getAllProduct, getProducto } from "../classes/Produto.js";
import { atualizarEstoque, novoEstoque } from "../classes/Estoque.js";

let produtos = [];
const productsPerPage = 100;
let currentPage = 1;
let totalProducts = 0;
let totalPages = 0;

const searchBar = document.getElementById('search-bar');
const firstPageButton = document.querySelector('button[onclick="goToPage(\'first\')"]');
const prevPageButton = document.querySelector('button[onclick="goToPage(\'prev\')"]');
const nextPageButton = document.querySelector('button[onclick="goToPage(\'next\')"]');
const lastPageButton = document.querySelector('button[onclick="goToPage(\'last\')"]');
const productTableBody = document.getElementById('productTableBody');
const currentPageDisplay = document.getElementById('currentPage');

document.addEventListener('DOMContentLoaded', async () => {

    console.log('DOM content loaded');

    // Theme toggle
    document.querySelector('.theme-toggle').addEventListener('click', () => {
        document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    });

    if (searchBar && firstPageButton && prevPageButton && nextPageButton && lastPageButton && productTableBody && currentPageDisplay) {
        console.log('All necessary elements are present in the DOM');
        produtos = await getAllProduct();
        renderProductTable(currentPage);

        firstPageButton.addEventListener('click', () => goToPage('first'));
        prevPageButton.addEventListener('click', () => goToPage('prev'));
        nextPageButton.addEventListener('click', () => goToPage('next'));
        lastPageButton.addEventListener('click', () => goToPage('last'));
        searchBar.addEventListener('input', searchProducts);

    } else {
        console.error('One or more elements are missing from the DOM');
    }

    // Check if there's a SKU in the URL and fill the form
    const urlParams = new URLSearchParams(window.location.search);
    const sku = urlParams.get('sku');
    if (sku) {
        preencherFormulario(sku);
    }
});

function renderProductTable(page = 1, products = produtos) {
    console.log(`Rendering product table for page ${page}`);
    totalProducts = products.length;
    totalPages = Math.ceil(totalProducts / productsPerPage);
    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;
    const productsToShow = products.slice(start, end);

    const tbody = document.getElementById('productTableBody');
    tbody.innerHTML = '';

    productsToShow.forEach(produto => {
        const row = document.createElement('tr');
        row.setAttribute('data-sku', produto.sku);
        row.innerHTML = `
        <td><img src="${produto.imageUrl}" alt="${produto.name}" onError="this.onerror=null;this.src='placeholder.jpg';"></td>
        <td>${produto.name}</td>
        <td>${produto.sku}</td>
        <td>${produto.brand}</td>
        <td>${produto.price}</td>   
        <td><input type="number" value="${produto.quantity}" onchange="novoEstoque('${produto.sku}', this.value)"></td>
      `;
        tbody.appendChild(row);

        // Adicionar event listener apenas para a célula de quantidade
        row.querySelector('input[type="number"]').addEventListener('click', (event) => {
            event.stopPropagation(); // Impede a propagação do evento para evitar redirecionamento
        });

        // Adicionar event listener para redirecionar ao clicar na linha (exceto na célula de quantidade)
        row.addEventListener('click', () => {
            window.location.href = `produto.html?sku=${produto.sku}`;
        });
    });

    document.getElementById('currentPage').textContent = page;
}

function goToPage(action) {
    console.log(`Going to page ${action}`);
    if (action === 'first') {
        currentPage = 1;
    } else if (action === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (action === 'next' && currentPage < totalPages) {
        currentPage++;
    } else if (action === 'last') {
        currentPage = totalPages;
    }
    renderProductTable(currentPage);
}

function searchProducts() {
    const term = searchBar.value.toLowerCase();
    console.log(`Searching products with term: ${term}`);
    const filteredProducts = produtos.filter(produto => {
        const name = produto.name ? produto.name.toLowerCase() : '';
        const sku = produto.sku ? produto.sku.toLowerCase() : '';
        const brand = produto.brand ? produto.brand.toLowerCase() : '';
        const ean = produto.ean ? produto.ean.toLowerCase() : '';

        return name.includes(term) || sku.includes(term) || brand.includes(term) || ean.includes(term);
    });

    renderProductTable(1, filteredProducts);
}

// async function atualizarEstoque(sku, quantidade) {
//     quantidade = parseInt(quantidade, 10);
//     console.log(`Updating stock for SKU: ${sku} with quantity: ${quantidade}`);
//     if (isNaN(quantidade) || quantidade < 0) {
//         alert('Quantidade inválida');
//         return;
//     }
//     await updateProduct(sku, { quantity: quantidade });
//     alert('Estoque atualizado com sucesso');
//     console.log(`Stock updated for SKU: ${sku}`);

//     const ids = await getProductIdsBySku(sku);

//     const deposito = new Deposito();
//     const depositos = await deposito.getDeposito();
//     const idDeposito = Object.values(depositos).map(deposito => deposito.request.id);

//     for (const id of idDeposito) {
//         for (const i in ids) {
//             const estoque = new Estoque({
//                 produto: {
//                     id: i
//                 },
//                 depositos: {
//                     id: id
//                 },
//                 operacao: 'B',
//                 quantidade: parseFloat(quantidade),
//             });
//             const result = await estoque.createEstoque();
//             console.log('Result:', result);
//         }
//     }
// }

async function preencherFormulario(sku) {
    const produto = await getProducto(sku);
    if (produto) {
        document.getElementById('name').value = produto.name;
        document.getElementById('sku').value = produto.sku;
        document.getElementById('ean').value = produto.ean;
        document.getElementById('category').value = produto.category;
        document.getElementById('brand').value = produto.brand;
        document.getElementById('price').value = produto.price;
        document.getElementById('quantity').value = produto.quantity;
        document.getElementById('url-image').value = produto.imageUrl;
        document.getElementById('product-preview-image').src = produto.imageUrl;
        document.getElementById('description').value = produto.description;
    }
}

window.novoEstoque = novoEstoque;
window.searchProducts = searchProducts;
