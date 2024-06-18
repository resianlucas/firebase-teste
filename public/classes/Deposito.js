import { BaseClass } from './BaseClass.js'

const baseUrl = 'http://localhost:3000/api'

class Deposito extends Bling {
    constructor({
        id = null,
        idLoja = 0
    } = {}) {
        super({ idLoja });
        this.id = id;
    }

    getDeposito() {
        const endpoint = '/depositos';
        let url = baseUrl + endpoint;
        let accessToken = this.getBling();
        console.log('url: ', url)
        try {
            let requests = [];
            for (let id in accessToken) {
                const blingInfo = accessToken[id];
                console.log('bling info: ', blingInfo)
                let request = {
                    'url': url,
                    'method': 'get',
                    'headers': {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Bearer ${blingInfo.accessToken}`
                    }
                }
                console.log('request: ', request);
                requests.push(request);
            }
            let responses = UrlFetchApp.fetchAll(requests);
            let result = {};
            for (let i = 0; i < responses.length; i++) {
                let response = JSON.parse(responses[i].getContentText());
                let blingInfo = accessToken[i];
                const depositoPadrao = response.data.find(deposito => deposito.padrao === true);

                result = {
                    id: blingInfo.idLoja,
                    empresa: blingInfo.nome,
                    dataHora: dataHora,
                    method: 'getDeposito',
                    request: depositoPadrao
                };
            }
            return result;
        } catch (e) {
            console.error('Erro no metodo getDeposito:', e.message);
            if (e.response) {
                console.error('Response code:', e.response.getResponseCode());
                console.error('Response body:', e.response.getContentText());
            }
            return null
        }
    }
}