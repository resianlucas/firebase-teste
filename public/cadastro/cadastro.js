import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Firebase configuration
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
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Helper function to encode form data
function encodeFormData(data) {
    return Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');
}

// Function to get the next available ID
async function generateNextId() {
    const idRef = ref(db, 'bling/ids');
    const snapshot = await get(idRef);
    if (snapshot.exists()) {
        const ids = snapshot.val();
        const lastId = Math.max(...Object.values(ids));
        return lastId + 1;
    } else {
        return 1; // Start from 1 if no IDs exist
    }
}

// Function to validate clientId uniqueness
async function isClientIdUnique(clientId) {
    const clientRef = ref(db, 'bling/' + clientId);
    const snapshot = await get(clientRef);
    return !snapshot.exists();
}

// Handle form submission
const cadastrar = document.getElementById("cadastroBling");

cadastrar.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nomeEmpresa = document.getElementById('nomeEmpresa').value;
    const clientId = document.getElementById('clientId').value;
    const clientSecret = document.getElementById('clientSecret').value;
    const code = document.getElementById('code').value;

    async function getToken() {
        const url = 'http://localhost:3000/api/Api/v3';  // URL do proxy
        const credentials = btoa(clientId + ':' + clientSecret);

        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Basic ${credentials}`
            },
            body: encodeFormData({
                'grant_type': "authorization_code",
                'code': code
            })
        };
        console.log(url);
        console.log(options);

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Erro na solicitação de token: ' + response.statusText);
        }
        return await response.json();
    }

    try {
        const isUnique = await isClientIdUnique(clientId);
        if (!isUnique) {
            alert('clientId já está em uso!');
            return;
        }

        const data = await getToken();
        const newId = await generateNextId();
        const newItemRef = ref(db, 'bling/' + nomeEmpresa);

        await set(newItemRef, {
            id: newId,
            name: nomeEmpresa,
            client_id: clientId,
            client_secret: clientSecret,
            access_token: data.access_token,
            refresh_token: data.refresh_token
        });

        // Save the new ID in the ids list
        const idListRef = ref(db, 'bling/ids/' + newId);
        await set(idListRef, newId);

        alert('Item adicionado com sucesso!');
        cadastrar.reset();
    } catch (error) {
        alert('Erro ao adicionar item: ' + error);
    }
});
