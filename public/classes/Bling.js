class Bling {
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
        this.isRefreshing = false;
        this.tokenQueue = [];
        this.isProcessingTokenQueue = false;
    }

    // Método para adicionar uma requisição de token à fila
    addTokenRequestToQueue(request) {
        this.tokenQueue.push(request);
        this.processTokenQueue();
    }

    // Método para processar a fila de requisições de token
    processTokenQueue() {
        if (this.tokenQueue.length > 0 && !this.isProcessingTokenQueue) {
            this.isProcessingTokenQueue = true;
            const request = this.tokenQueue.shift();
            request(() => {
                this.isProcessingTokenQueue = false;
                this.processTokenQueue();
            });
        }
    }


    getToken(tokenType, callback) {
        const processToken = (done) => {
            if (this.isRefreshing && tokenType === 'refresh') {
                while (this.isRefreshing) {
                    Utilities.sleep(100); // Espera 100ms antes de verificar novamente
                }
            }
            const credentials = Utilities.base64Encode(this.clientId + ':' + this.clientSecret);
            let options = {
                'method': 'post',
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${credentials}`
                }
            };
            if (tokenType === 'access') {
                options.payload = {
                    'grant_type': 'authorization_code',
                    'code': this.code
                };
            } else if (tokenType === 'refresh') {
                options.payload = {
                    'grant_type': 'refresh_token',
                    'refresh_token': this.refreshToken
                };
                this.isRefreshing = true;
            }

            try {
                let reqs = UrlFetchApp.fetch('https://www.bling.com.br/Api/v3/oauth/token', options);
                let ress = JSON.parse(reqs.getContentText());
                if (tokenType === 'access') {
                    this.accessToken = ress.access_token;
                    this.refreshToken = ress.refresh_token;
                } else if (tokenType === 'refresh') {
                    this.accessToken = ress.access_token;
                    this.refreshToken = ress.refresh_token;
                }
                atualizarTabelaConfig(this);
            } catch (e) {
                console.error('Error fetching token:', e.message);
                if (e.response) {
                    console.error('Response code:', e.response.getResponseCode());
                    console.error('Response body:', e.response.getContentText());
                }
            } finally {
                if (tokenType === 'refresh') {
                    this.isRefreshing = false;
                }
                done();
                if (callback) {
                    callback();
                }
            }
        };

        this.addTokenRequestToQueue(processToken);
    }

    static getAllIds() {
        const sheetConfig = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Config');
        const lastRow = sheetConfig.getLastRow();
        const ids = sheetConfig.getRange(2, 1, lastRow - 1, 1).getValues();
        return ids;
    }

    static getLastId() {
        const sheetConfig = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Config');
        const lastRow = sheetConfig.getLastRow();
        const lastId = lastRow > 1 ? sheetConfig.getRange(lastRow, 1).getValue() : 0;
        return lastId;
    }

    static generateNextId() {
        return Bling.getLastId() + 1;
    }

    getBling() {
        const idLoja = this.idLoja;
        console.log(idLoja)
        if (!idLoja) {
            const allIds = Bling.getAllIds(); // Supondo que getAllIds() retorne uma lista de IDs
            if (!allIds || allIds.length === 0) {
                return null; // Retorna null se não houver IDs
            }
            const results = [];
            for (const id of allIds) {
                const dadosDoBanco = consultarTabelaConfig(id);

                if (dadosDoBanco) {
                    this.idLoja = dadosDoBanco.idLoja;
                    this.nome = dadosDoBanco.nome;
                    this.clientId = dadosDoBanco.clientId;
                    this.clientSecret = dadosDoBanco.clientSecret;
                    this.refreshToken = dadosDoBanco.refreshToken;
                    this.getToken('refresh', () => {
                        results.push({
                            idLoja: this.idLoja,
                            nome: this.nome,
                            accessToken: this.accessToken,
                            refreshToken: this.refreshToken
                        });
                    });
                }
            }
            return results;
        } else {
            const id = [idLoja]
            console.log(id)
            const dadosDoBanco = consultarTabelaConfig(id);
            console.log(dadosDoBanco);

            if (dadosDoBanco) {
                this.idLoja = dadosDoBanco.idLoja;
                this.nome = dadosDoBanco.nome;
                this.clientId = dadosDoBanco.clientId;
                this.clientSecret = dadosDoBanco.clientSecret;
                this.refreshToken = dadosDoBanco.refreshToken;
                const result = []
                this.getToken('refresh', () => {
                    result.push({
                        idLoja: this.idLoja,
                        nome: this.nome,
                        accessToken: this.accessToken,
                        refreshToken: this.refreshToken
                    });
                });
                return result;
            } else {
                return null;
            }
        }
    }

    setBling() {
        const dadosDaTabela = consultarTabelaDados();

        if (dadosDaTabela) {
            this.idLoja = Bling.generateNextId();
            this.nome = dadosDaTabela.nome;
            this.code = dadosDaTabela.code;
            this.clientId = dadosDaTabela.clientId;
            this.clientSecret = dadosDaTabela.clientSecret;
            this.getToken('access');

            salvarTabelaConfig(this);
            return this;
        } else {
            return null;
        }
    }
}

function consultarTabelaConfig(idLoja) {
    console.log(idLoja)
    const sheetConfig = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Config');
    const lastRow = sheetConfig.getLastRow();
    const tabelaData = sheetConfig.getRange(2, 1, lastRow - 1, 6).getValues();

    const tabela = tabelaData.map(t => ({
        idLoja: t[0],
        nome: t[1],
        clientId: t[2],
        clientSecret: t[3],
        accessToken: t[4],
        refreshToken: t[5]
    }))

    const cadastro = tabela.find(bling => bling.idLoja === idLoja[0]);

    console.log(cadastro)

    if (cadastro) {
        return {
            idLoja: cadastro.idLoja,
            nome: cadastro.nome,
            clientId: cadastro.clientId,
            clientSecret: cadastro.clientSecret,
            accessToken: cadastro.accessToken,
            refreshToken: cadastro.refreshToken
        };
    } else {
        return null;
    }
}

function consultarTabelaDados() {
    const sheetDados = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('TelaBuscar');
    const lastRow = sheetDados.getLastRow();
    const tabela = sheetDados.getRange(2, 1, lastRow, 4).getValues();

    if (tabela.length > 0) {
        const dados = tabela[0]; // Vamos pegar apenas os dados da primeira linha encontrada

        return {
            nome: dados[0],
            code: dados[1],
            clientId: dados[2],
            clientSecret: dados[3]
        };
    } else {
        return null; // Retorna null se não houver dados na tabela
    }
}

function salvarTabelaConfig(bling) {
    const sheetConfig = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Config');

    // Obter a próxima linha disponível na tabela
    const nextRow = sheetConfig.getLastRow() + 1;

    // Extrair os valores dos dados recebidos
    const values = [
        [
            bling.idLoja,
            bling.nome,
            bling.clientId,
            bling.clientSecret,
            bling.accessToken,
            bling.refreshToken
        ]
    ];

    // Inserir os valores na próxima linha disponível
    sheetConfig.getRange(nextRow, 1, 1, 6).setValues(values);
}

function atualizarTabelaConfig(bling) {
    const sheetConfig = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Config');
    const lastRow = sheetConfig.getLastRow();
    const tabela = sheetConfig.getRange(2, 1, lastRow - 1, 6).getValues();
    const cadastro = tabela.find(cad => cad[0] === bling.idLoja);

    var linha = tabela.indexOf(cadastro) + 2;

    if (cadastro) {
        sheetConfig.getRange(linha, 5).setValue(bling.accessToken);
        sheetConfig.getRange(linha, 6).setValue(bling.refreshToken);

        let success = false;
        for (let i = 0; i < 5; i++) { // Tenta verificar até 5 vezes
            Utilities.sleep(200); // Espera 200ms antes de verificar novamente
            const checkAccessToken = sheetConfig.getRange(linha, 5).getValue();
            const checkRefreshToken = sheetConfig.getRange(linha, 6).getValue();
            if (checkAccessToken === bling.accessToken && checkRefreshToken === bling.refreshToken) {
                success = true;
                break;
            }
        }

        if (!success) {
            throw new Error('Falha ao atualizar a planilha com os novos tokens.');
        }
    }

    return true;
}