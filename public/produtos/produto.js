import { getProducto, criarProduto } from '../classes/Produto.js';
import { listarCategorias } from '../classes/Categoria.js'


const addItemForm = document.getElementById('addItemForm');
const categoriaSelect = document.getElementById('category');

// Função para preencher o menu suspenso de categorias
async function preencherCategorias() {
    const categorias = await listarCategorias();

    console.log('categorias dos produtos: ',categorias)

    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.name; // Supondo que as categorias têm um campo 'nome'
        option.textContent = categoria.name;
        categoriaSelect.appendChild(option);
    });
}

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
document.getElementById('url-image').addEventListener('input', function() {
    const imageUrl = this.value;
    const imagePreview = document.getElementById('product-preview-image');
    
    if (imageUrl) {
        imagePreview.src = imageUrl;
    } else {
        imagePreview.src = 'placeholder.jpg';
    }
});

addItemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('loadingOverlay').style.display = 'flex';
    addItemForm.querySelector('button[type="submit"]').disabled = true;


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

    await criarProduto(product)
        .then(() => {
            console.log('Item adicionado com sucesso!');
            document.getElementById('addItemForm').reset();
            window.history.back();
        })
        .catch((error) => {
            console.error('Erro ao adicionar item:', error);
            alert('Erro ao adicionar item: ' + error);
        })
        .finally(() => {
            document.getElementById('loadingOverlay').style.display = 'none';
            addItemForm.querySelector('button[type="submit"]').disabled = false;
        })
});


async function preencherFormulario(sku) {
    const produto = await getProducto(sku)
    
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

document.addEventListener('DOMContentLoaded', preencherCategorias);
