const baseUrl = 'http://localhost:3000/api'

class NotaFiscal extends BaseClass {
    constructor({
        id = null,
        tipo = 0,
        situacao = 0,
        numero = '',
        dataEmissao = '',
        dataOperacao = '',
        contato = {
            id: null,
            nome: '',
            numeroDocumento: '',
            ie: '',
            rg: '',
            telefone: '',
            email: '',
            endereco: {
                endereco: '',
                numero: '',
                complemento: '',
                bairro: '',
                cep: '',
                municipio: '',
                uf: '',
                pais: ''
            }
        },
        naturezaOperacao = {
            id: null
        },
        loja = {
            id: null
        },
        serie = 0,
        chaveAcesso = '',
        xml = '',
        linkDanfe = '',
        linkPDF = '',
        transporte = {
            fretePorConta: 0,
            transportador: {
                nome: '',
                numeroDocumento: ''
            },
            volumes: [
                {
                    id: null
                }
            ],
            etiqueta: {
                nome: '',
                endereco: '',
                numero: '',
                complemento: '',
                municipio: '',
                uf: '',
                cep: '',
                bairro: ''
            }
        },
        params = {
            pagina: 0,
            limite: 0,
            numeroLoja: '',
            situacao: 0,
            tipo: '',
            dataEmissaoInicial: '',
            dataEmissaoFinal: ''
        },
        idLoja
    }) {
        if (typeof id !== 'number' && id !== null) {
            throw new TypeError('O id deve ser um número ou null');
        }
        if (typeof tipo !== 'number') {
            throw new TypeError('O tipo deve ser um número');
        }
        if (typeof situacao !== 'number') {
            throw new TypeError('A situação deve ser um número');
        }
        if (typeof numero !== 'string') {
            throw new TypeError('O número deve ser uma string');
        }
        if (typeof dataEmissao !== 'string') {
            throw new TypeError('A data de emissão deve ser uma string');
        }
        if (typeof dataOperacao !== 'string') {
            throw new TypeError('A data de operação deve ser uma string');
        }
        if (typeof contato !== 'object') {
            throw new TypeError('O contato deve ser um objeto');
        }
        if (typeof contato.id !== 'number' && contato.id !== null) {
            throw new TypeError('O id de contato deve ser um número ou null');
        }
        if (typeof contato.nome !== 'string') {
            throw new TypeError('O nome de contato deve ser uma string');
        }
        if (typeof contato.numeroDocumento !== 'string') {
            throw new TypeError('O número de documento de contato deve ser uma string');
        }
        if (typeof contato.ie !== 'string') {
            throw new TypeError('A IE de contato deve ser uma string');
        }
        if (typeof contato.rg !== 'string') {
            throw new TypeError('O RG de contato deve ser uma string');
        }
        if (typeof contato.telefone !== 'string') {
            throw new TypeError('O telefone de contato deve ser uma string');
        }
        if (typeof contato.email !== 'string') {
            throw new TypeError('O email de contato deve ser uma string');
        }
        if (typeof contato.endereco !== 'object') {
            throw new TypeError('O endereço de contato deve ser um objeto');
        }
        if (typeof contato.endereco.endereco !== 'string') {
            throw new TypeError('O endereço de contato deve ser uma string');
        }
        if (typeof contato.endereco.numero !== 'string') {
            throw new TypeError('O número do endereço de contato deve ser uma string');
        }
        if (typeof contato.endereco.complemento !== 'string') {
            throw new TypeError('O complemento do endereço de contato deve ser uma string');
        }
        if (typeof contato.endereco.bairro !== 'string') {
            throw new TypeError('O bairro do endereço de contato deve ser uma string');
        }
        if (typeof contato.endereco.cep !== 'string') {
            throw new TypeError('O CEP do endereço de contato deve ser uma string');
        }
        if (typeof contato.endereco.municipio !== 'string') {
            throw new TypeError('O município do endereço de contato deve ser uma string');
        }
        if (typeof contato.endereco.uf !== 'string') {
            throw new TypeError('A UF do endereço de contato deve ser uma string');
        }
        if (typeof contato.endereco.pais !== 'string') {
            throw new TypeError('O país do endereço de contato deve ser uma string');
        }
        if (typeof naturezaOperacao !== 'object') {
            throw new TypeError('A natureza da operação deve ser um objeto');
        }
        if (typeof naturezaOperacao.id !== 'number' && naturezaOperacao.id !== null) {
            throw new TypeError('O id da natureza da operação deve ser um número ou null');
        }
        if (typeof loja !== 'object') {
            throw new TypeError('A loja deve ser um objeto');
        }
        if (typeof loja.id !== 'number' && loja.id !== null) {
            throw new TypeError('O id da loja deve ser um número ou null');
        }
        if (typeof serie !== 'number') {
            throw new TypeError('A série deve ser um número');
        }
        if (typeof chaveAcesso !== 'string') {
            throw new TypeError('A chave de acesso deve ser uma string');
        }
        if (typeof xml !== 'string') {
            throw new TypeError('O XML deve ser uma string');
        }
        if (typeof linkDanfe !== 'string') {
            throw new TypeError('O link da DANFE deve ser uma string');
        }
        if (typeof linkPDF !== 'string') {
            throw new TypeError('O link do PDF deve ser uma string');
        }
        if (typeof transporte !== 'object') {
            throw new TypeError('O transporte deve ser um objeto');
        }
        if (typeof transporte.fretePorConta !== 'number') {
            throw new TypeError('O frete por conta do transporte deve ser um número');
        }
        if (typeof transporte.transportador !== 'object') {
            throw new TypeError('O transportador deve ser um objeto');
        }
        if (typeof transporte.transportador.nome !== 'string') {
            throw new TypeError('O nome do transportador deve ser uma string');
        }
        if (typeof transporte.transportador.numeroDocumento !== 'string') {
            throw new TypeError('O número do documento do transportador deve ser uma string');
        }
        if (!Array.isArray(transporte.volumes)) {
            throw new TypeError('Os volumes do transporte devem ser uma matriz');
        }
        transporte.volumes.forEach(volume => {
            if (typeof volume.id !== 'number' && volume.id !== null) {
                throw new TypeError('O id do volume deve ser um número ou null');
            }
        });
        if (typeof transporte.etiqueta !== 'object') {
            throw new TypeError('A etiqueta do transporte deve ser um objeto');
        }
        if (typeof transporte.etiqueta.nome !== 'string') {
            throw new TypeError('O nome da etiqueta do transporte deve ser uma string');
        }
        if (typeof transporte.etiqueta.endereco !== 'string') {
            throw new TypeError('O endereço da etiqueta do transporte deve ser uma string');
        }
        if (typeof transporte.etiqueta.numero !== 'string') {
            throw new TypeError('O número da etiqueta do transporte deve ser uma string');
        }
        if (typeof transporte.etiqueta.complemento !== 'string') {
            throw new TypeError('O complemento da etiqueta do transporte deve ser uma string');
        }
        if (typeof transporte.etiqueta.municipio !== 'string') {
            throw new TypeError('O município da etiqueta do transporte deve ser uma string');
        }
        if (typeof transporte.etiqueta.uf !== 'string') {
            throw new TypeError('A UF da etiqueta do transporte deve ser uma string');
        }
        if (typeof transporte.etiqueta.cep !== 'string') {
            throw new TypeError('O CEP da etiqueta do transporte deve ser uma string');
        }
        if (typeof transporte.etiqueta.bairro !== 'string') {
            throw new TypeError('O bairro da etiqueta do transporte deve ser uma string');
        }

        super({ idLoja });
        this.id = id;
        this.tipo = tipo;
        this.situacao = situacao;
        this.numero = numero;
        this.dataEmissao = dataEmissao;
        this.dataOperacao = dataOperacao;
        this.contato = contato;
        this.naturezaOperacao = naturezaOperacao;
        this.loja = loja;
        this.serie = serie;
        this.chaveAcesso = chaveAcesso;
        this.xml = xml;
        this.linkDanfe = linkDanfe;
        this.linkPDF = linkPDF;
        this.transporte = transporte;
        this.params = params;
    }

    //////////////////////////////
    //METODOS DE COMUNICAÇÃO API//
    //////////////////////////////
    getNFe() {
        const endpoint = '/nfe'
        let url = baseUrl + endpoint;
        let queryString = this.buildQueryString(this.params)
        if (queryString) {
            url += '?' + queryString;
        }
        let options = {
            'method': 'get',
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${this.getBling().accessToken}`
            },
            'muteHttpExceptions': true
        }
        let reqs = UrlFetchApp.fetch(url, options);
        let ress = JSON.parse(reqs.getContentText());
        var notas = [];

        ress.data.forEach(dado => {
            notas.push([
                dado.id,
                dado.numero
            ])
        })
        return notas;
    }

    getNFeById(idNotaFiscal) {
        const endpoint = `/nfe/${idNotaFiscal}`;
        let url = baseUrl + endpoint;
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

                // Salvar informações associadas à resposta
                result[blingInfo.nome] = {
                    id: blingInfo.idLoja,
                    empresa: blingInfo.nome,
                    dataHora: dataHora,
                    method: 'getNFeById',
                    request: response.data
                };
            }
            return result;
        } catch (error) {
            console.error('Erro gerado: ', error.stack);
            return null;
        }
    }
}