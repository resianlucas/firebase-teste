import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, child, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Configuração do Firebase
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

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function encodeFormData(data) {
    return Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');
}

// Função para buscar os blings cadastrados no Firebase
export async function fetchBlings() {
    const dbRef = ref(db);
    try {
        const snapshot = await get(child(dbRef, 'bling'));
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.log("Nenhum dado disponível");
            return null;
        }
    } catch (error) {
        console.error("Erro ao buscar dados: ", error);
        throw error;
    }
}

export async function refreshBlingToken(clientId, clientSecret, refreshToken, id) {
    const url = 'http://localhost:3000/api/Api/v3'; // URL do proxy ou servidor que gerencia o refresh token

    const credentials = btoa(clientId + ":" + clientSecret);

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${credentials}`
        },
        body: encodeFormData({
            'grant_type': 'refresh_token',
            'refresh_token': refreshToken
        })
    };

    console.log('Request URL:', url);
    console.log('Request Headers:', options.headers);
    console.log('Request Body:', options.body);

    try {
        const response = await fetch(url, options);
        console.log('Response Status:', response.status);
        console.log('Response Headers:', [...response.headers.entries()]);
        const responseText = await response.text();
        console.log('Response Text:', responseText);

        if (!response.ok) {
            throw new Error('Erro na solicitação de refresh token: ' + response.statusText);
        }

        const data = JSON.parse(responseText);
        console.log('Parsed Response Data:', data);

        // Atualiza os tokens no Firebase
        const companiesRef = ref(db, 'bling');
        const snapshot = await get(companiesRef);
        if (snapshot.exists()) {
            const companies = snapshot.val();
            const companyKey = Object.keys(companies).find(key => companies[key].id === id);

            if (companyKey) {
                const itemRef = ref(db, 'bling/' + companyKey);
                await update(itemRef, {
                    access_token: data.access_token,
                    refresh_token: data.refresh_token
                });
                
                // Exibe o alerta de sucesso
                alert('Token atualizado com sucesso!');
                return data; // Retorna os dados para indicar sucesso
            } else {
                throw new Error('Company with the specified ID not found.');
            }
        } else {
            throw new Error('No companies found in the database.');
        }

    } catch (error) {
        console.error('Erro ao atualizar token:', error);
        alert('Erro ao atualizar token: ' + error.message); // Exibe o alerta de erro
        throw error; // Lança o erro para tratamento posterior
    }
}

export { db , app };
