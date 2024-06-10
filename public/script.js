// public/script.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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
