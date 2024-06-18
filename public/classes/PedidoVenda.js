import { BaseClass } from './BaseClass.js'

const baseUrl = 'http://localhost:3000/api'

class PedidoVenda extends BaseClass {
    constructor({
        id = null,
        numero = 0,
        numeroLoja = '',
        data = '',
        dataSaida = '',
        dataPrevista = '',
        totalProdutos = 0,
        total = 0,
        contato = {
            id: null,
            nome: '',
            tipoPessoa: '',
            numeroDocumento: ''
        },
        situacao = {
            id: null,
            valor: 0
        },
        loja = {
            id: null
        },
        numeroPedidoCompra = '',
        outrasDespesas = 0,
        observacoes = '',
        observacoesInternas = '',
        desconto = {
            valor: 0,
            unidade: ''
        },
        categoria = {
            id: null
        },
        notaFiscal = {
            id: null
        },
        tributacao = {
            totalICMS: 0,
            totalIPI: 0
        },
        itens = [
            {
                id: null,
                codigo: '',
                unidade: '',
                quantidade: 0,
                desconto: 0,
                valor: 0,
                aliquotaIPI: 0,
                descricao: '',
                descricaoDetalhada: '',
                produto: {
                    id: null
                },
                comissao: {
                    base: 0,
                    aliquota: 0,
                    valor: 0
                }
            }
        ],
        parcelas = [
            {
                id: null,
                dataVencimento: '',
                valor: 0,
                observacoes: '',
                formaPagamento: {
                    id: null
                }
            }
        ],
        transporte = {
            fretePorConta: 0,
            frete: 0,
            quantidadeVolumes: 0,
            pesoBruto: 0,
            prazoEntrega: 0,
            contato: {
                id: null,
                nome: ''
            },
            etiqueta: {
                nome: '',
                endereco: '',
                numero: '',
                complemento: '',
                municipio: '',
                uf: '',
                cep: '',
                bairro: '',
                nomePais: ''
            },
            volumes: [
                {
                    id: null,
                    servico: '',
                    codigoRastreamento: ''
                }
            ]
        },
        vendedor = {
            id: null
        },
        intermediador = {
            cnpj: '',
            nomeUsuario: ''
        },
        taxas = {
            taxaComissao: 0,
            custoFrete: 0,
            valorBase: 0
        },
        params = {
            pagina: null,
            limite: null,
            idContato: null,
            idsSituacoes: [],
            dataInicial: '',
            dataFinal: '',
            dataAlteracaoFinal: '',
            dataPrevistaInicial: '',
            dataPrevistaFinal: '',
            numero: null,
            idLoja: null,
            idVendedor: null,
            idControleCaixa: null,
            numerosLojas: []
        },
        idLoja
    } = {}) {

        if (typeof id !== 'number' && id !== null) {
            throw new TypeError('O id deve ser um número ou null');
        }
        if (typeof numero !== 'number') {
            throw new TypeError('O número deve ser um número');
        }
        if (typeof numeroLoja !== 'string') {
            throw new TypeError('O número da loja deve ser uma string');
        }
        if (typeof data !== 'string') {
            throw new TypeError('A data deve ser uma string');
        }
        if (typeof dataSaida !== 'string') {
            throw new TypeError('A data de saída deve ser uma string');
        }
        if (typeof dataPrevista !== 'string') {
            throw new TypeError('A data prevista deve ser uma string');
        }
        if (typeof totalProdutos !== 'number') {
            throw new TypeError('O total de produtos deve ser um número');
        }
        if (typeof total !== 'number') {
            throw new TypeError('O total deve ser um número');
        }
        if (typeof outrasDespesas !== 'number') {
            throw new TypeError('As outras despesas devem ser um número');
        }
        if (typeof observacoes !== 'string') {
            throw new TypeError('As observações devem ser uma string');
        }
        if (typeof observacoesInternas !== 'string') {
            throw new TypeError('As observações internas devem ser uma string');
        }
        if (typeof desconto.valor !== 'number') {
            throw new TypeError('O valor do desconto deve ser um número');
        }
        if (typeof desconto.unidade !== 'string') {
            throw new TypeError('A unidade do desconto deve ser uma string');
        }
        if (typeof categoria.id !== 'number' && categoria.id !== null) {
            throw new TypeError('O id da categoria deve ser um número ou null');
        }
        if (typeof notaFiscal.id !== 'number' && notaFiscal.id !== null) {
            throw new TypeError('O id da nota fiscal deve ser um número ou null');
        }
        if (typeof tributacao.totalICMS !== 'number') {
            throw new TypeError('O total de ICMS deve ser um número');
        }
        if (typeof tributacao.totalIPI !== 'number') {
            throw new TypeError('O total de IPI deve ser um número');
        }
        if (!Array.isArray(itens)) {
            throw new TypeError('Os itens devem ser um array');
        }
        if (!Array.isArray(parcelas)) {
            throw new TypeError('As parcelas devem ser um array');
        }
        if (typeof transporte.fretePorConta !== 'number') {
            throw new TypeError('O frete por conta deve ser um número');
        }
        if (typeof transporte.frete !== 'number') {
            throw new TypeError('O frete deve ser um número');
        }
        if (typeof transporte.quantidadeVolumes !== 'number') {
            throw new TypeError('A quantidade de volumes deve ser um número');
        }
        if (typeof transporte.pesoBruto !== 'number') {
            throw new TypeError('O peso bruto deve ser um número');
        }
        if (typeof transporte.prazoEntrega !== 'number') {
            throw new TypeError('O prazo de entrega deve ser um número');
        }
        if (typeof vendedor.id !== 'number' && vendedor.id !== null) {
            throw new TypeError('O id do vendedor deve ser um número ou null');
        }
        if (typeof intermediador.cnpj !== 'string') {
            throw new TypeError('O CNPJ do intermediador deve ser uma string');
        }
        if (typeof intermediador.nomeUsuario !== 'string') {
            throw new TypeError('O nome do usuário do intermediador deve ser uma string');
        }
        if (typeof taxas.taxaComissao !== 'number') {
            throw new TypeError('A taxa de comissão deve ser um número');
        }
        if (typeof taxas.custoFrete !== 'number') {
            throw new TypeError('O custo do frete deve ser um número');
        }
        if (typeof taxas.valorBase !== 'number') {
            throw new TypeError('O valor base deve ser um número');
        }

        super({ idLoja });
        this.id = id;
        this.numero = numero;
        this.numeroLoja = numeroLoja;
        this.data = data;
        this.dataSaida = dataSaida;
        this.dataPrevista = dataPrevista;
        this.totalProdutos = totalProdutos;
        this.total = total;
        this.contato = contato;
        this.situacao = situacao;
        this.loja = loja;
        this.numeroPedidoCompra = numeroPedidoCompra;
        this.outrasDespesas = outrasDespesas;
        this.observacoes = observacoes;
        this.observacoesInternas = observacoesInternas;
        this.desconto = desconto;
        this.categoria = categoria;
        this.notaFiscal = notaFiscal;
        this.tributacao = tributacao;
        this.itens = itens;
        this.parcelas = parcelas;
        this.transporte = transporte;
        this.vendedor = vendedor;
        this.intermediador = intermediador;
        this.taxas = taxas;
        this.params = params;
    }
    //////////////////////////////
    //METODOS DE COMUNICAÇÃO API//
    //////////////////////////////
    async getPedidoVenda() {
        const endpoint = '/pedidos/vendas';
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
                console.log('Bling Info: ', blingInfo)
                return fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${blingInfo.access_token}`
                    }
                });
            });

            console.log('REQUESTS: ', requests)
    
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
    
                let blingInfo = accessToken[Object.keys(accessToken)[i]];
    
                if (response.data && response.data.length > 0) {
                    const pedidos = response.data.map(dado => [
                        dado.id,
                        dado.numero,
                        dado.numeroLoja,
                        dado.data,
                        dado.loja.id,
                        blingInfo.idLoja,
                    ]);
    
                    // Salvar informações associadas à resposta
                    result[blingInfo.nome] = {
                        id: blingInfo.idLoja,
                        empresa: blingInfo.nome,
                        dataHora: new Date().toISOString(),
                        method: 'getPedidoVenda',
                        request: pedidos
                    };
                }
            }
            return result;
        } catch (error) {
            console.error('Erro ao buscar pedidos de venda:', error);
            return null;
        }
    }
    

    getPedidoVendaById(idPedidoVenda) {
        const endpoint = `/pedidos/vendas/${idPedidoVenda}`;
        let url = baseUrl + endpoint;
        console.log('url: ', url);
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

                var pedido = {
                    id: response.data.id,
                    numero: response.data.numero,
                    numeroLoja: response.data.numeroLoja,
                    data: response.data.data,
                    total: response.data.total,
                    situacao: response.data.situacao,
                    itens: response.data.itens,
                    notaFiscal: response.data.notaFiscal,
                    idLoja: response.data.loja.id
                }

                // Salvar informações associadas à resposta
                result[blingInfo.nome] = {
                    id: blingInfo.idLoja,
                    empresa: blingInfo.nome,
                    dataHora: dataHora,
                    method: 'getPedidoVendaById',
                    request: pedido
                };
            }
            return result
        } catch (error) {
            console.error('Erro gerado: ', error.stack);
            return null;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('testButton').addEventListener('click', async () => {
        const pedidoVenda = new PedidoVenda();
        const result = await pedidoVenda.getPedidoVenda();
        console.log('Result:', result);
    });
});