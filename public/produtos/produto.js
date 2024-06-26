import { getProducto, criarProduto } from '../classes/Produto.js';


const addItemForm = document.getElementById('addItemForm');

function converterPreco(preco) {
    const precoNumerico = parseFloat(preco.replace(',', '.').replace(/[^0-9.]/g, ''));
    return parseFloat(precoNumerico.toFixed(2));
}

function converterQuantidade(quantidade) {
    return parseInt(quantidade.replace(/[^0-9]/g, ''), 10);
}

document.querySelector('.theme-toggle').addEventListener('click', () => {
    document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
});

addItemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const product = {
        name: document.getElementById("name").value,
        sku: document.getElementById("sku").value,
        ean: document.getElementById("ean").value,
        category: document.getElementById("category").value,
        brand: document.getElementById("brand").value,
        price: converterPreco(document.getElementById("price").value),
        quantity: converterQuantidade(document.getElementById("quantity").value),
        imageUrl: document.getElementById("url-image").value,
        description: document.getElementById("description").value
    };

    console.log('Produto a ser armazenado:', product);

    criarProduto(product)
        .then(() => {
            console.log('Item adicionado com sucesso!');
            alert('Item adicionado com sucesso!');
            document.getElementById('addItemForm').reset();
        })
        .catch((error) => {
            console.error('Erro ao adicionar item:', error);
            alert('Erro ao adicionar item: ' + error);
        });
});


async function preencherFormulario(sku) {
    const produto = await getProducto(sku)
    // const produtoRef = ref(db, 'products/' + sku);
    // const snapshot = await get(produtoRef);

    // if (snapshot.exists()) {
    //const produto = snapshot.val();
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

// Check if there's a SKU in the URL and fill the form
const urlParams = new URLSearchParams(window.location.search);
const sku = urlParams.get('sku');
if (sku) {
    preencherFormulario(sku);
}
