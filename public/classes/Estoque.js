import { Deposito } from './Deposito.js'
import { BaseClass } from './BaseClass.js'


const baseUrl = 'http://localhost:3000/api'

class Estoque extends BaseClass {
    constructor({
        produto = {
            id: null
        },
        quantidade = 0,
        operacao = '',
        saldoFisicoTotal = 0,
        saldoVirtualTotal = 0,
        depositos = {
            id: 0
        },
        params = {
            idsProdutos: [],
            codigo: '',
            idProduto: '',
            quantidade: 0,
            operacao: ''
        },
        idLoja = null
    } = {}) {
        if (typeof produto.id !== 'number' && produto.id !== null) {
            throw new TypeError('O id do produto deve ser um Número ou null')
        }
        if (typeof quantidade !== 'number') {
            throw new TypeError('A quantidade deve ser um Número');
        }
        if (!['B', 'E', 'S', null, '', 'undefined'].includes(operacao)) {
            throw new Error('A operacao deve ser "B", "E" ou "S".');
        }
        if (typeof saldoFisicoTotal !== 'number') {
            throw new TypeError('O saldoFisicoTotal deve ser um Número');
        }
        if (typeof saldoVirtualTotal !== 'number') {
            throw new TypeError('O saldoVirtualTotal deve ser um Número');
        }
        if (typeof depositos.id !== 'number' && depositos.id !== null) {
            throw new TypeError('O id do depósito deve ser um Número ou null');
        }

        super({ idLoja });
        this.produto = { id: produto.id };
        this.quantidade = quantidade;
        this.operacao = operacao;
        this.depositos = { id: depositos.id }
        this.saldoFisicoTotal = saldoFisicoTotal;
        this.saldoVirtualTotal = saldoVirtualTotal;
        this.params = params;


    }

    //////////////////////////////
    //METODOS DE COMUNICAÇÃO API//
    //////////////////////////////
    async getEstoque() {
        const endpoint = '/estoques/saldos';
        let url = baseUrl + endpoint;
        let queryString = this.buildQueryString(this.params);
        if (queryString) {
            url += '?' + queryString;
        }

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
                let response = await responses[i].text(); // Alterado para text() para pegar HTML
                try {
                    response = JSON.parse(response); // Tenta parsear como JSON
                } catch (e) {
                    console.error(`Erro ao parsear resposta do servidor ${i}:`, response);
                    continue;
                }

                console.log('RESPONSE: ', response)

                let blingInfo = accessToken[Object.keys(accessToken)[i]];

                if (response.data && response.data.length > 0) {
                    const estoques = response.data.map(dado => ({
                        id: dado.produto.id,
                        quantidade: dado.saldoVirtualTotal
                    }));

                    console.log('estoques:', estoques);

                    // Salvar informações associadas à resposta
                    result[blingInfo.name] = {
                        id: blingInfo.id,
                        empresa: blingInfo.name,
                        dataHora: new Date().toISOString(),
                        method: 'getEstoque',
                        request: estoques
                    };
                }
            }
            return result;
        } catch (error) {
            console.error('Erro ao buscar estoques:', error);
            return null;
        }
    }


    async createEstoque() {
        const endpoint = '/estoques';
        let url = baseUrl + endpoint;
    
        let accessToken = await this.getBling();
        console.log('Access Token:', accessToken);
    
        try {
            let requests = Object.keys(accessToken).map(id => {
                const blingInfo = accessToken[id];
                console.log('Bling Info:', blingInfo);
                return fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${blingInfo.access_token}`
                    },
                    body: JSON.stringify({
                        idProduto: this.produto.id,
                        idDeposito: this.depositos.id,
                        operacao: this.operacao,
                        quantidade: this.quantidade,
                        preco: 0,
                        custo: 0,
                        observacoes: "Atualizado pelo sistema de controle de estoque"
                    })
                });
            });
    
            console.log('REQUESTS:', requests);
    
            let responses = await Promise.all(requests);
    
            let result = {};
            for (let i = 0; i < responses.length; i++) {
                let response = await responses[i].text();
                try {
                    response = JSON.parse(response);
                    console.log(response)
                } catch (e) {
                    console.error(`Erro ao parsear resposta do servidor ${i}:`, response);
                    continue;
                }
    
                let blingInfo = accessToken[Object.keys(accessToken)[i]];
    
                // Salvar informações associadas à resposta
                result[blingInfo.name] = {
                    id: blingInfo.id,
                    empresa: blingInfo.name,
                    dataHora: new Date().toISOString(),
                    method: 'createEstoque',
                    request: response.data
                };
            }
            return result;
    
        } catch (error) {
            console.error('Erro ao criar estoque:', error);
            throw new Error('Erro ao criar estoque: ' + error);
        }
    }
    
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('testButton').addEventListener('click', async () => {


        const idLoja = document.getElementById('parametro-funcao').value
        const quantidade = document.getElementById('parametro-quantidade').value
        const deposito = new Deposito({
            idLoja: idLoja
        })
        
        const depositos = await deposito.getDeposito();
        const idDeposito = Object.values(depositos).map(deposito => deposito.request.id);
        
        for (const id of idDeposito) {
            const estoque = new Estoque({
                produto : {
                    id: 16239460759
                },
                depositos: {
                    id: id
                },
                operacao: 'B',
                quantidade: parseFloat(quantidade),
                idLoja: idLoja
            })
            const result = await estoque.createEstoque();
            console.log('Result:', result);
        }
    });
});