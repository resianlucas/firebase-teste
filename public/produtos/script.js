// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDJTzpoFxQ9_W0JCGPXfwFasr_vdywwePs",
    authDomain: "hub-stock-control.firebaseapp.com",
    databaseURL: "https://hub-stock-control-default-rtdb.firebaseio.com",
    projectId: "hub-stock-control",
    storageBucket: "hub-stock-control.appspot.com",
    messagingSenderId: "1006784039020",
    appId: "1:1006784039020:web:5b824b2c2f0a2deed47049",
    measurementId: "G-LDEPBP8926"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let produtos = [];
const productsPerPage = 100;
let currentPage = 1;
let totalProducts = 0;
let totalPages = 0;
const searchBar = document.getElementById('search-bar');

async function fetchProducts() {
    const snapshot = await db.collection('products').get();
    produtos = snapshot.docs.map(doc => doc.data());
    renderProductTable(currentPage);
}

function renderProductTable(page = 1) {
    totalProducts = produtos.length;
    totalPages = Math.ceil(totalProducts / productsPerPage);
    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;
    const productsToShow = produtos.slice(start, end);

    const tbody = document.getElementById('productTableBody');
    tbody.innerHTML = '';

    productsToShow.forEach(produto => {
        const row = document.createElement('tr');
        row.setAttribute('data-sku', produto.sku);
        row.innerHTML = `
        <td><img src="${produto.image}" alt="${produto.name}"></td>
        <td>${produto.name}</td>
        <td>${produto.sku}</td>
        <td>${produto.brand}</td>
        <td>${produto.price}</td>
        <td><input type="number" value="${produto.quantity}" onchange="atualizarEstoque('${produto.sku}', this.value)"></td>
      `;
        tbody.appendChild(row);
    });

    document.getElementById('currentPage').textContent = page;
}

function goToPage(action) {
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
    const filteredProducts = produtos.filter(produto =>
        produto.name.toLowerCase().includes(term) ||
        produto.sku.toLowerCase().includes(term) ||
        produto.brand.toLowerCase().includes(term)
    );

    const tbody = document.getElementById('productTableBody');
    tbody.innerHTML = '';

    filteredProducts.forEach(produto => {
        const row = document.createElement('tr');
        row.setAttribute('data-sku', produto.sku);
        row.innerHTML = `
        <td><img src="${produto.imagem}" alt="${produto.nome}"></td>
        <td>${produto.name}</td>
        <td>${produto.sku}</td>
        <td>${produto.brand}</td>
        <td>${produto.price}</td>
        <td><input type="number" value="${produto.quantity}" onchange="atualizarEstoque('${produto.sku}', this.value)"></td>
      `;
        tbody.appendChild(row);
    });
}

async function atualizarEstoque(sku, quantidade) {
    quantidade = parseInt(quantidade, 10);
    if (isNaN(quantidade) || quantidade < 0) {
        alert('Quantidade inválida');
        return;
    }
    await db.collection('produtos').doc(sku).update({ qtd: quantidade });
    alert('Estoque atualizado com sucesso');
}

document.addEventListener('DOMContentLoaded', fetchProducts);
