import { BaseClass } from './BaseClass.js'
import { getAllCategories, createCategory, getCategoriaByDesc} from '../database/categoria.js';

const baseUrl = 'http://localhost:3000/api'

export default class Categoria extends BaseClass {
    constructor({
        id = null,
        descricao = '',
        categoriaPai = {
            id: 0
        },
        idLoja = 0,
        payload = {
            descricao: '',
            categoriaPai: {
                id: 0
            }
        }
    } = {}) {
        super({ idLoja });
        this.id = id;
        this.descricao = descricao;
        this.categoriaPai = categoriaPai;
        this.payload = payload;
    }

    async getCategoria() {
        const endpoint = '/categorias/produtos';
        let url = baseUrl + endpoint;
        let queryString = this.buildQueryString(this.params);
        if (queryString) {
            url += '?' + queryString;
        }
        console.log('URL:', url);

        let accessToken = await this.getBling();

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
                    console.log('response: ', response)
                } catch (e) {
                    console.error(`Erro ao parsear resposta do servidor ${i}:`, response);
                    continue;
                }
                let blingInfo = accessToken[Object.keys(accessToken)[i]];

                result[blingInfo.name] = {
                    id: blingInfo.id,
                    empresa: blingInfo.name,
                    dataHora: new Date().toISOString(),
                    method: 'getCategoria',
                    request: response.data
                };
            }
            return result;
        } catch (e) {
            console.error('Erro no método getCategoria:', e.message);
            return null;
        }
    }

    async getCategoriaById(idCategoria) {
        const endpoint = `/categorias/produtos/${idCategoria}`;
        let url = baseUrl + endpoint;
        let accessToken = await this.getBling();

        try {
            let requests = Object.keys(accessToken).map(id => {
                const blingInfo = accessToken[id];
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
                } catch (e) {
                    console.error(`Erro ao parsear resposta do servidor ${i}:`, response);
                    continue;
                }

                let blingInfo = accessToken[Object.keys(accessToken)[i]];

                result[blingInfo.name] = {
                    id: blingInfo.id,
                    empresa: blingInfo.name,
                    dataHora: new Date().toISOString(),
                    method: 'getCategoriaById',
                    request: response.data
                };
            }
            return result;
        } catch (e) {
            console.error('Erro no método getCategoriaById:', e.message);
            return null;
        }
    }

    async createCategoria() {
        const endpoint = '/categorias/produtos';
        let url = baseUrl + endpoint;
        console.log('URL: ', url);

        let accessToken = await this.getBling();

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
                    body: JSON.stringify(this.payload)
                });
            });

            console.log('REQUESTS:', requests);

            let responses = await Promise.all(requests);

            let result = {};
            for (let i = 0; i < responses.length; i++) {
                let response = await responses[i].text();
                try {
                    response = JSON.parse(response);
                    console.log('response: ', response)
                } catch (e) {
                    console.error(`Erro ao parsear resposta do servidor ${i}:`, response);
                    continue;
                }

                let blingInfo = accessToken[Object.keys(accessToken)[i]];

                result[blingInfo.name] = {
                    id: blingInfo.id,
                    empresa: blingInfo.name,
                    dataHora: new Date().toISOString(),
                    method: 'createCategoria',
                    request: response.data
                };
            }
            return result;
        } catch (e) {
            console.error('Erro no método createCategoria:', e.message);
            return null;
        }
    }

    async getCategoriasLoja() {
        const endpoint = '/categorias/lojas';
        let url = baseUrl + endpoint;
        let queryString = this.buildQueryString(this.params);
        if (queryString) {
            url += '?' + queryString;
        }
        let accessToken = await this.getBling();

        try {
            let requests = Object.keys(accessToken).map(id => {
                const blingInfo = accessToken[id];
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
                } catch (e) {
                    console.error(`Erro ao parsear resposta do servidor ${i}:`, response);
                    continue;
                }
                let blingInfo = accessToken[Object.keys(accessToken)[i]];

                result[blingInfo.name] = {
                    id: blingInfo.id,
                    empresa: blingInfo.name,
                    dataHora: new Date().toISOString(),
                    method: 'getCategoria',
                    request: response.data
                };
            }
            return result;
        } catch (e) {
            console.error('Erro no método getCategoria:', e.message);
            return null;
        }
    }

    async createCategoriaLoja(loja, descricao, codigo, categoriaProduto) {
        const endpoint = '/categorias/lojas';
        let url = baseUrl + endpoint;

        let accessToken = await this.getBling();

        loja = parseInt(loja, 10);
        descricao = String(descricao);
        codigo = String(codigo);
        categoriaProduto = parseInt(categoriaProduto, 10);

        const body = {
            "loja": {
                "id": loja
            },
            "descricao": descricao,
            "codigo": codigo,
            "categoriaProduto": {
                "id": categoriaProduto
            }
        }

        try {
            let requests = Object.keys(accessToken).map(id => {
                const blingInfo = accessToken[id];
                return fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${blingInfo.access_token}`
                    },
                    body: JSON.stringify(body)
                });
            });

            let responses = await Promise.all(requests);

            let result = {};
            for (let i = 0; i < responses.length; i++) {
                let response = await responses[i].text();
                try {
                    response = JSON.parse(response);
                } catch (e) {
                    console.error(`Erro ao parsear resposta do servidor ${i}:`, response);
                    continue;
                }

                let blingInfo = accessToken[Object.keys(accessToken)[i]];

                result[blingInfo.name] = {
                    id: blingInfo.id,
                    empresa: blingInfo.name,
                    dataHora: new Date().toISOString(),
                    method: 'createCategoria',
                    request: response.data
                };
            }
            return result;
        } catch (e) {
            console.error('Erro no método createCategoria:', e.message);
            return null;
        }
    }
}

export async function listarCategorias() {
    try {
        const categorias = await getAllCategories();
        return categorias;
    } catch (error) {

    }
}

export async function criarCategoria(categoria) {
    try {
        await createCategory(categoria)
    } catch (error) {
        console.error(`Erro ao cadastrar categoria: ${error}`)
    }
}



document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('testButto').addEventListener('click', async () => {
        try {
            const categoria = new Categoria({
                idLoja: 1
            })
            //const id = document.getElementById('parametro-funca').value

            const cat = await categoria.getCategoriasLoja()
            const categorias = cat.Styllo.request;
            console.log(categorias)

            for (const id of categorias) {
                const idP = id.categoriaProduto.id;
                const categoriaProduto = await categoria.getCategoriaById(idP);
                await sleep(200);
                console.log(id)
                console.log(categoriaProduto.Styllo.request);
                const descricao = categoriaProduto.Styllo.request.descricao;
                const idCatProd = await getCategoriaByDesc(descricao);
                console.log("id", idCatProd.id)
                console.log("informações\n" ,
                    "descrição: ", id.descricao, "\n",
                    "codigo: ", id.codigo, "\n",
                    "id da categoria: ", idCatProd.id, "\n",
                )
                const loja = 203744342;
                const desc = id.descricao;
                const codigo = id.codigo;
                const idCat = idCatProd.id;
                const categoriaBarros = new Categoria({
                    idLoja: 2
                })
                const result = await categoriaBarros.createCategoriaLoja(203744342,desc,codigo,idCat)
                console.log('Operação finalizada: ', result)
            }

            console.log('Operação finalizada: ', cat.Styllo.request);
        } catch (error) {
            console.log("Erro ao pegar produtos: ", error)
        }
    })
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
