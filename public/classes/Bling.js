import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const baseUrl = 'http://localhost:3000/api'

// Your web app's Firebase configuration
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

function encodeFormData(data) {
    return Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');
}

export class Bling {
    constructor({
        idLoja = 0,
        nome = '',
        code = '',
        accessToken = '',
        refreshToken = '',
        clientId = '',
        clientSecret = ''
    } = {}) {
        this.idLoja = idLoja;
        this.nome = nome;
        this.code = code;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    async getToken(tokenType = 'token') {
        const credentials = btoa(`${this.clientId}:${this.clientSecret}`);
        const url = 'http://localhost:3000/api'; // URL do proxy

        let options;

        if (tokenType === 'token') {
            options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${credentials}`
                },
                body: encodeFormData({
                    'grant_type': 'authorization_code',
                    'code': this.code
                })
            };
        } else if (tokenType === 'refresh_token') {
            options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${credentials}`
                },
                body: encodeFormData({
                    'grant_type': 'refresh_token',
                    'refresh_token': this.refreshToken
                })
            };
        }

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Erro na solicitação de token: ${response.statusText}`);
            }
            const data = await response.json();
            this.accessToken = data.access_token;
            this.refreshToken = data.refresh_token;

            const newItemRef = ref(db, `bling/${this.clientId}`);
            await set(newItemRef, {
                name: this.nome,
                client_id: this.clientId,
                client_secret: this.clientSecret,
                access_token: this.accessToken,
                refresh_token: this.refreshToken
            });

            console.log('Tokens updated and saved to Firebase:', data);
        } catch (error) {
            console.error('Erro ao atualizar o token:', error);
        }
    }

    async getBling() {
        const dbRef = ref(db);
        try {
            const snapshot = await get(child(dbRef, 'bling/'));
            if (snapshot.exists()) {
                const blings = snapshot.val();
                console.log('Blings:', blings);
                return blings;
            } else {
                console.log('No bling data available');
                return null;
            }
        } catch (error) {
            console.error('Erro ao buscar blings:', error);
        }
    }
}