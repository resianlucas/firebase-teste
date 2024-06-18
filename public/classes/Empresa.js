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
    getEmpresas() {
        const endpoint = '/empresas/me/dados-basicos'
        let url = baseUrl + endpoint;
        let options = {
            'method': 'get',
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${accessToken}`
            },
            'muteHttpExceptions': true
        }
        let reqs = UrlFetchApp.fetch(url, options);
        let ress = JSON.parse(reqs.getContentText());
        return ress.data
    }
}