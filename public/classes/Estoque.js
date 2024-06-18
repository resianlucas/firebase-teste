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
    }) {
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
    getEstoque() {
        const endpoint = '/estoques/saldos'
        let url = baseUrl + endpoint;
        let queryString = this.buildQueryString(this.params);
        if (queryString) {
            url += '?' + queryString;
        }
        let accessToken = this.getBling();

        try {
            let requests = [];
            for (let id in accessToken) {
                const blingInfo = accessToken[id];
                let request = {
                    'url': url,
                    'method': 'get',
                    'headers': {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Bearer ${blingInfo.accessToken}`
                    }
                };
                requests.push(request);
            }
            let responses = UrlFetchApp.fetchAll(requests);
            let result = {};
            for (let i = 0; i < responses.length; i++) {
                let response = JSON.parse(responses[i].getContentText());
                let blingInfo = accessToken[i];

                var estoques = [];

                response.data.forEach(data => {
                    estoques.push({
                        id: data.produto.id,
                        quantidade: data.saldoVirtualTotal
                    });
                });

                console.log('estoques: ', estoques);

                // Salvar informações associadas à resposta
                result[blingInfo.nome] = {
                    id: blingInfo.idLoja,
                    empresa: blingInfo.nome,
                    dataHora: dataHora,
                    method: 'getEstoque',
                    request: estoques
                };
            }
            return result;
        } catch (error) {
            console.error('Erro gerado: ', error.stack);
            return null;
        }
    }

    createEstoque() {
        const endpoint = '/estoques'
        let url = baseUrl + endpoint;

        let accessToken = this.getBling();
        try {
            let requests = [];
            for (let id in accessToken) {
                const blingInfo = accessToken[id];
                let request = {
                    'url': url,
                    'method': 'post',
                    'payload': {
                        'idProduto': this.produto.id,
                        'idDeposito': this.depositos.id,
                        "operacao": this.operacao,
                        "quantidade": this.quantidade,
                        "preco": 0,
                        "custo": 0,
                        "observacoes": "Atualizado pelo sistema de controle de estoque"
                    },
                    'headers': {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Bearer ${blingInfo.accessToken}`
                    }
                }
                requests.push(request);
            }
            let responses = UrlFetchApp.fetchAll(requests);
            let result = {};
            for (let i = 0; i < responses.length; i++) {
                let response = JSON.parse(responses[i].getContentText());
                let blingInfo = accessToken[i];

                // Salvar informações associadas à resposta
                result[blingInfo.nome] = {
                    id: blingInfo.idLoja,
                    empresa: blingInfo.nome,
                    dataHora: dataHora,
                    method: 'createEstoque',
                    request: response.data
                };
            }
            return result

        } catch (erro) {
            throw new Error('Erro ao criar estoque: ' + erro);
        }
    }
}