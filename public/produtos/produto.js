import { getProducto, criarProduto, deletarProduto } from '../classes/Produto.js';
import { listarCategorias } from '../classes/Categoria.js';

const addItemForm = document.getElementById('addItemForm');
const categoriaSelect = document.getElementById('category');
const deleteButton = document.getElementById('deleteButton');

// Função para preencher o menu suspenso de categorias
async function preencherCategorias() {
    const categorias = await listarCategorias();
   
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.name; // Supondo que as categorias têm um campo 'name'
        option.textContent = categoria.name;
        categoriaSelect.appendChild(option);
    });

    // Preencher o formulário se houver um SKU na URL
    const urlParams = new URLSearchParams(window.location.search);
    const sku = urlParams.get('sku');
    //const sku = "Kit Sh+Cond Menina Baby Muriel"

    if (sku) {
        await preencherFormulario(sku);
    }
}

// Função para preencher o formulário com os dados do produto
async function preencherFormulario(sku) {
    const produto = await getProducto(sku);
    
    document.getElementById('name').value = produto.name;
    document.getElementById('sku').value = produto.sku;
    document.getElementById('ean').value = produto.ean;
    document.getElementById('brand').value = produto.brand;
    document.getElementById('price').value = produto.price;
    document.getElementById('quantity').value = produto.quantity;
    document.getElementById('url-image').value = produto.imageUrl;
    document.getElementById('product-preview-image').src = produto.imageUrl;
    document.getElementById('description').value = produto.description;

    const options = categoriaSelect.options;
    for (let i = 0; i < options.length; i++) {
        if (options[i].value === produto.category) {
            categoriaSelect.selectedIndex = i;
            break;
        }
    }
}

// Funções de conversão de preço e quantidade
function converterPreco(preco) {
    const precoNumerico = parseFloat(preco.replace(',', '.').replace(/[^0-9.]/g, ''));
    return parseFloat(precoNumerico.toFixed(2));
}

function converterQuantidade(quantidade) {
    return parseInt(quantidade.replace(/[^0-9]/g, ''), 10);
}

// Troca de tema
document.querySelector('.theme-toggle').addEventListener('click', () => {
    document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
});

// Previsão de imagem do produto
document.getElementById('url-image').addEventListener('input', function() {
    const imageUrl = this.value;
    const imagePreview = document.getElementById('product-preview-image');
    
    if (imageUrl) {
        imagePreview.src = imageUrl;
    } else {
        imagePreview.src = 'placeholder.jpg';
    }
});

// Manipulação do envio do formulário
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
    })
    .catch((error) => {
        console.error('Erro ao adicionar item:', error);
        alert('Erro ao adicionar item: ' + error);
    })
    .finally(() => {
        document.getElementById('loadingOverlay').style.display = 'none';
        addItemForm.querySelector('button[type="submit"]').disabled = false;
        window.history.back();
    });
});

deleteButton.addEventListener('click', async () => {
    const sku = document.getElementById('sku').value;
    if (confirm('Você tem certeza que deseja deletar o produto?')) {
        if (confirm('Esta ação é irreversível. Tem certeza que deseja continuar?')) {
            try {
                await deletarProduto(sku);
                alert('Produto deletado com sucesso!');
                // Opcional: redirecionar ou atualizar a página após a exclusão
                window.location.href = 'produtos.html';
            } catch (error) {
                console.error('Erro ao deletar o produto:', error);
                alert('Erro ao deletar o produto: ' + error);
            }
        }
    }
});


// Preencher as categorias após carregar a página
document.addEventListener('DOMContentLoaded', preencherCategorias);
