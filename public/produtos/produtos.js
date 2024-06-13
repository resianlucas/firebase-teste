import { db } from '/public/script.js';
import { ref, set, update, remove, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const addItemForm = document.getElementById('addItemForm');
const inventoryList = document.getElementById('inventoryList');

// Function to add item to Firebase
addItemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const product = {
        name: document.getElementById("name").value,
        sku: document.getElementById("sku").value,
        ean: document.getElementById("ean").value,
        category: document.getElementById("category").value,
        brand: document.getElementById("brand").value,
        price: document.getElementById("price").value,
        quantity: document.getElementById("quantity").value,
        imageUrl: document.getElementById("url-image").value,
        description: document.getElementById("description").value
    };

    console.log('Produto a ser armazenado:', product);
    
    const newItemRef = ref(db, 'products/' + product.sku);
    set(newItemRef, product)
    .then(() => {
        console.log('Item adicionado com sucesso!');
        alert('Item adicionado com sucesso!');
        document.getElementById('addItemForm').reset();
        fetchInventory();
    })
    .catch((error) => {
        console.error('Erro ao adicionar item:', error);
        alert('Erro ao adicionar item: ' + error);
    });
});

// Function to fetch and display inventory
function fetchInventory() {
    console.log('Fetching inventory...');
    const inventoryRef = ref(db, 'products/');
    onValue(inventoryRef, (snapshot) => {
        inventoryList.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            console.log('Item encontrado:', childData);
            const li = document.createElement('li');
            li.textContent = `${childData.name}: ${childData.quantity}`;
            li.style.cursor = 'pointer';
            li.onclick = () => {
                window.location.href = `produto.html?sku=${childSnapshot.key}`;
            };

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Deletar';
            deleteButton.onclick = (e) => {
                e.stopPropagation();
                deleteItem(childSnapshot.key);
            };

            const updateButton = document.createElement('button');
            updateButton.textContent = 'Alterar';
            updateButton.onclick = (e) => {
                e.stopPropagation();
                updateItem(childSnapshot.key, prompt('Nova quantidade:', childData.quantity));
            };

            li.appendChild(deleteButton);
            li.appendChild(updateButton);
            inventoryList.appendChild(li);
        });

        // Add "Create New Product" button
        const createButton = document.createElement('button');
        createButton.textContent = 'Criar Novo Produto';
        createButton.onclick = () => {
            window.location.href = 'produto.html';
        };
        inventoryList.appendChild(createButton);
    });
}

// Function to delete item from Firebase
function deleteItem(itemKey) {
    console.log('Deletando item:', itemKey);
    const itemRef = ref(db, 'products/' + itemKey);
    remove(itemRef)
    .then(() => {
        console.log('Item deletado com sucesso!');
        alert('Item deletado com sucesso!');
        fetchInventory();
    })
    .catch((error) => {
        console.error('Erro ao deletar item:', error);
        alert('Erro ao deletar item: ' + error);
    });
}

// Function to update item quantity in Firebase
function updateItem(itemKey, newQuantity) {
    if (newQuantity !== null) {
        console.log('Atualizando item:', itemKey, 'Nova quantidade:', newQuantity);
        const itemRef = ref(db, 'products/' + itemKey);
        update(itemRef, {
            quantity: newQuantity
        })
        .then(() => {
            console.log('Item alterado com sucesso!');
            alert('Item alterado com sucesso!');
            fetchInventory();
        })
        .catch((error) => {
            console.error('Erro ao alterar item:', error);
            alert('Erro ao alterar item: ' + error);
        });
    } else {
        console.log('Alteração de item cancelada.');
    }
}

// Fetch inventory on load
console.log('Carregando inventário...');
fetchInventory();
