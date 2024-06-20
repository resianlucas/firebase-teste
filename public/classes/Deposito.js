import { BaseClass } from './BaseClass.js'

const baseUrl = 'http://localhost:3000/api'

export class Deposito extends BaseClass {
    constructor({
        id = null,
        idLoja = 0
    } = {}) {
        super({ idLoja });
        this.id = id;
    }

    async getDeposito() {
        const endpoint = '/depositos';
        let url = baseUrl + endpoint;
        console.log('URL:', url);
    
        let accessToken = await this.getBling();
        console.log('Access Token:', accessToken);
    
        try {
            let requests = Object.keys(accessToken).map(id => {
                const blingInfo = accessToken[id];
                console.log('Bling Info:', blingInfo);
                return fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${blingInfo.access_token}`
                    }
                });
            });
    
            console.log('REQUESTS:', requests);
    
            let responses = await Promise.all(requests);
    
            let result = {};
            for (let i = 0; i < responses.length; i++) {
                let response = await responses[i].text();
                try {
                    response = JSON.parse(response);
                    console.log('response: ',response)
                } catch (e) {
                    console.error(`Erro ao parsear resposta do servidor ${i}:`, response);
                    continue;
                }
    
                let blingInfo = accessToken[Object.keys(accessToken)[i]];
                const depositoPadrao = response.data.find(deposito => deposito.padrao === true);
    
                result[blingInfo.name] = {
                    id: blingInfo.id,
                    empresa: blingInfo.name,
                    dataHora: new Date().toISOString(),
                    method: 'getDeposito',
                    request: depositoPadrao
                };
            }
            return result;
        } catch (e) {
            console.error('Erro no método getDeposito:', e.message);
            return null;
        }
    }
    
}

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('testButton').addEventListener('click', async () => {

        const id = document.getElementById('parametro-funcao').value

        const deposito = new Deposito();

        const result = await deposito.getDeposito();
        console.log('Result:', result);
    });
});