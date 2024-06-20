import { BaseClass } from './BaseClass.js'

const baseUrl = 'http://localhost:3000/api'

class Empresa extends BaseClass {
    constructor({
        nome = '',
        cnpj = '',
        email = '',
        idLoja
    }) {
        if (typeof nome !== 'string') {
            throw new TypeError('O nome deve ser uma string')
        }
        if (typeof cnpj !== 'string') {
            throw new TypeError('O cnpj deve ser uma string')
        }
        if (typeof email !== 'string') {
            throw new TypeError('O email deve ser uma string')
        }
        super({ idLoja });
        this.nome = nome;
        this.cnpj = cnpj;
        this.email = email;
    }

    //////////////////////////////
    //METODOS DE COMUNICAÇÃO API//
    //////////////////////////////
    async getEmpresas() {
        const endpoint = '/empresas/me/dados-basicos'

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
    
                result[blingInfo.name] = {
                    id: blingInfo.id,
                    empresa: blingInfo.name,
                    dataHora: new Date().toISOString(),
                    method: 'getEmpresa',
                    request: response.data
                };
            }
            return result;
        } catch (e) {
            console.log("Erro no método getEmpresa: ", e.message);
            return null;
        }



        let ress = JSON.parse(reqs.getContentText());
        return ress.data
    }
}