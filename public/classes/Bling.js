import { getNewBling, createBling, updateBling} from '../database/bling.js';

const baseUrl = 'http://localhost:3000/api'

function encodeFormData(data) {
    return Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');
}

export class Bling {
    constructor({
        idLoja = null   ,
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

            const newBling = {
                name: this.nome,
                client_id: this.clientId,
                client_secret: this.clientSecret,
                access_token: this.accessToken,
                refresh_token: this.refreshToken
            }

            createBling(newBling);

            console.log('Tokens updated and saved to Firebase:', data);
        } catch (error) {
            console.error('Erro ao atualizar o token:', error);
        }
    }

    async getBling() {
        let idLoja = this.idLoja;
        const bling = await getNewBling(idLoja);
        return bling;
    }
}