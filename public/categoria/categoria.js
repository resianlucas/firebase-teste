import { criarCategoria } from "../classes/Categoria.js";

const addItemForm = document.getElementById('categoria');

addItemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const category = {
        name: document.getElementById("nomeCategoria").value,
        ncm: document.getElementById("ncm").value,
        cest: document.getElementById("cest").value,
    };

    console.log('Categoria a ser armazenado:', category);

    await criarCategoria(category)
        .then(() => {
            console.log('Item adicionado com sucesso!');
            alert('Item adicionado com sucesso!');
            document.getElementById('categoria').reset();
        })
        .catch((error) => { 
            console.error('Erro ao adicionar item:', error);
            alert('Erro ao adicionar item: ' + error);
        });
});

// async function preencherFormulario(sku) {
//     const produto = await getProducto(sku)
    
//     document.getElementById('name').value = produto.name;
//     document.getElementById('sku').value = produto.sku;
//     document.getElementById('ean').value = produto.ean;
//     document.getElementById('category').value = produto.category;
//     document.getElementById('brand').value = produto.brand;
//     document.getElementById('price').value = produto.price;
//     document.getElementById('quantity').value = produto.quantity;
//     document.getElementById('url-image').value = produto.imageUrl;
//     document.getElementById('product-preview-image').src = produto.imageUrl;
//     document.getElementById('description').value = produto.description;
// }

// Check if there's a SKU in the URL and fill the form
// const urlParams = new URLSearchParams(window.location.search);
// const sku = urlParams.get('sku');
// if (sku) {
//     preencherFormulario(sku);
// }

// document.addEventListener('DOMContentLoaded', preencherCategorias);
