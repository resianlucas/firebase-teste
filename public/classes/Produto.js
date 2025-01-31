import { BaseClass } from './BaseClass.js';
import { getProduct, getAllProducts, createProduct, updateProduct, getProductIdsBySku, setProductId, deleteProduct, getProductIdsBySkus } from '../database/produto.js';
import { novoEstoque } from './Estoque.js';
import { getCategory } from '../database/categoria.js';

const baseUrl = 'http://localhost:3000/api'

export default class Produto extends BaseClass {
    constructor({
        id = null,
        nome = '',
        codigo = '',
        preco = 0,
        tipo = '',
        situacao = '',
        formato = '',
        descricaoCurta = '',
        imagemURL = '',
        dataValidade = '',
        unidade = '',
        pesoLiquido = 0,
        pesoBruto = 0,
        volumes = 0,
        itensPorCaixa = 0,
        gtin = '',
        gtinEmbalagem = '',
        tipoProducao = '',
        condicao = 0,
        freteGratis = false,
        marca = '',
        descricaoComplementar = '',
        linkExterno = '',
        observacoes = '',
        descricaoEmbalagemDiscreta = '',
        categoria = { id: null },
        estoque = {
            minimo: 0,
            maximo: 0,
            crossdocking: 0,
            localizacao: ''
        },
        actionEstoque = '',
        dimensoes = {
            largura: 0,
            altura: 0,
            profundidade: 0,
            unidadeMedida: 0
        },
        tributacao = {
            origem: 0,
            nFCI: '',
            ncm: '',
            cest: '',
            codigoListaServicos: '',
            spedTipoItem: '',
            codigoItem: '',
            percentualTributos: 0,
            valorBaseStRetencao: 0,
            valorStRetencao: 0,
            valorICMSSubstituto: 0,
            codigoExcecaoTipi: '',
            classeEnquadramentoIpi: '',
            valorIpiFixo: 0,
            codigoSeloIpi: '',
            valorPisFixo: 0,
            valorCofinsFixo: 0,
            codigoANP: '',
            descricaoANP: '',
            percentualGLP: 0,
            percentualGasNacional: 0,
            percentualGasImportado: 0,
            valorPartida: 0,
            tipoArmamento: 0,
            descricaoCompletaArmamento: '',
            dadosAdicionais: '',
            grupoProduto: { id: null }
        },
        midia = {
            video: { url: '' },
            imagens: {
                externas: [{ link: '' }],
                internas: [{
                    linkMiniatura: '',
                    validade: '',
                    ordem: 0,
                    anexo: { id: null },
                    anexoVinculo: { id: null }
                }]
            }
        },
        linhaProduto = { id: null },
        estrutura = {
            tipoEstoque: '',
            lancamentoEstoque: '',
            componentes: [{
                produto: { id: null },
                quantidade: 0
            }]
        },
        camposCustomizados = [{
            idCampoCustomizado: 0,
            idVinculo: '',
            valor: '',
            item: ''
        }],
        variacoes = [{
            id: null,
            nome: '',
            codigo: '',
            preco: 0,
            tipo: '',
            situacao: '',
            formato: '',
            descricaoCurta: '',
            imagemURL: '',
            dataValidade: '',
            unidade: '',
            pesoLiquido: 0,
            pesoBruto: 0,
            volumes: 0,
            itensPorCaixa: 0,
            gtin: '',
            gtinEmbalagem: '',
            tipoProducao: '',
            condicao: 0,
            freteGratis: false,
            marca: '',
            descricaoComplementar: '',
            linkExterno: '',
            observacoes: '',
            descricaoEmbalagemDiscreta: '',
            categoria: { id: null },
            estoque: {
                minimo: 0,
                maximo: 0,
                crossdocking: 0,
                localizacao: ''
            },
            actionEstoque: '',
            dimensoes: {
                largura: 0,
                altura: 0,
                profundidade: 0,
                unidadeMedida: 0
            },
            tributacao: {
                origem: 0,
                nFCI: '',
                ncm: '',
                cest: '',
                codigoListaServicos: '',
                spedTipoItem: '',
                codigoItem: '',
                percentualTributos: 0,
                valorBaseStRetencao: 0,
                valorStRetencao: 0,
                valorICMSSubstituto: 0,
                codigoExcecaoTipi: '',
                classeEnquadramentoIpi: '',
                valorIpiFixo: 0,
                codigoSeloIpi: '',
                valorPisFixo: 0,
                valorCofinsFixo: 0,
                codigoANP: '',
                descricaoANP: '',
                percentualGLP: 0,
                percentualGasNacional: 0,
                percentualGasImportado: 0,
                valorPartida: 0,
                tipoArmamento: 0,
                descricaoCompletaArmamento: '',
                dadosAdicionais: '',
                grupoProduto: { id: null }
            },
            midia: {
                video: { url: '' },
                imagens: {
                    externas: [{ link: "" }],
                    internas: [{
                        linkMiniatura: '',
                        validade: '',
                        ordem: 0,
                        anexo: { id: null },
                        anexoVinculo: { id: null }
                    }]
                }
            },
            linhaProduto: { id: null },
            estrutura: {
                tipoEstoque: '',
                lancamentoEstoque: '',
                componentes: [{
                    produto: { id: null },
                    quantidade: 0
                }]
            },
            camposCustomizados: [{
                idCampoCustomizado: 0,
                idVinculo: '',
                valor: '',
                item: ''
            }],
            variacao: {
                nome: '',
                ordem: 0,
                produtoPai: { cloneInfo: false }
            }
        }],
        payload = {
            nome: "",
            tipo: "P",
            situacao: "A",
            formato: "S",
            codigo: "",
            preco: 1,
            descricaoCurta: "",
            imagemURL: "",
            dataValidade: "",
            unidade: "UN",
            pesoLiquido: 0,
            pesoBruto: 0,
            volumes: 1,
            itensPorCaixa: 1,
            gtin: "",
            gtinEmbalagem: "",
            tipoProducao: "P",
            condicao: 0,
            freteGratis: false,
            marca: "",
            descricaoComplementar: "",
            linkExterno: "",
            observacoes: "Produto anunciado pelo hub de controle de estoque.",
            descricaoEmbalagemDiscreta: "",
            categoria: {
                id: 123456789
            },
            estoque: {
                minimo: 2,
                maximo: 100,
                crossdocking: 1,
                localizacao: ""
            },
            actionEstoque: "T",
            dimensoes: {
                largura: 1,
                altura: 1,
                profundidade: 1,
                unidadeMedida: 1
            },
            tributacao: {
                origem: 0,
                nFCI: "",
                ncm: "",
                cest: "",
                codigoListaServicos: "",
                spedTipoItem: "",
                codigoItem: "",
                percentualTributos: 0,
                valorBaseStRetencao: 0,
                valorStRetencao: 0,
                valorICMSSubstituto: 0,
                codigoExcecaoTipi: "",
                classeEnquadramentoIpi: "",
                valorIpiFixo: 0,
                codigoSeloIpi: "",
                valorPisFixo: 0,
                valorCofinsFixo: 0,
                codigoANP: "",
                descricaoANP: "",
                percentualGLP: 0,
                percentualGasNacional: 0,
                percentualGasImportado: 0,
                valorPartida: 0,
                tipoArmamento: 0,
                descricaoCompletaArmamento: "",
                dadosAdicionais: "",
                grupoProduto: {
                    value: "<Error: Too many levels of nesting to fake this schema>"
                }
            },
            midia: {
                video: {
                    url: ""
                },
                imagens: {
                    internas: [],
                    externas: [{ link: '' }]
                }
            },
            linhaProduto: {
                id: 1
            },
            estrutura: {
                tipoEstoque: "F",
                lancamentoEstoque: "A",
                componentes: [
                    {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    }
                ]
            },
            // camposCustomizados: [
            //     {
            //         idCampoCustomizado: {
            //             value: "<Error: Too many levels of nesting to fake this schema>"
            //         },
            //         idVinculo: {
            //             value: "<Error: Too many levels of nesting to fake this schema>"
            //         },
            //         valor: {
            //             value: "<Error: Too many levels of nesting to fake this schema>"
            //         },
            //         item: {
            //             value: "<Error: Too many levels of nesting to fake this schema>"
            //         }
            //     },
            //     {
            //         idCampoCustomizado: {
            //             value: "<Error: Too many levels of nesting to fake this schema>"
            //         },
            //         idVinculo: {
            //             value: "<Error: Too many levels of nesting to fake this schema>"
            //         },
            //         valor: {
            //             value: "<Error: Too many levels of nesting to fake this schema>"
            //         },
            //         item: {
            //             value: "<Error: Too many levels of nesting to fake this schema>"
            //         }
            //     }
            // ],
            variacoes: [
                {
                    formato: "S",
                    nome: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    situacao: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    tipo: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    variacao: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    id: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    codigo: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    preco: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    descricaoCurta: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    imagemURL: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    dataValidade: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    unidade: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    pesoLiquido: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    pesoBruto: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    volumes: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    itensPorCaixa: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    gtin: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    gtinEmbalagem: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    tipoProducao: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    condicao: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    freteGratis: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    marca: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    descricaoComplementar: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    linkExterno: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    observacoes: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    descricaoEmbalagemDiscreta: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    categoria: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    estoque: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    actionEstoque: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    dimensoes: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    tributacao: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    midia: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    linhaProduto: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    estrutura: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    camposCustomizados: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    }
                },
                {
                    formato: "S",
                    nome: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    situacao: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    tipo: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    variacao: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    id: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    codigo: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    preco: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    descricaoCurta: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    imagemURL: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    dataValidade: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    unidade: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    pesoLiquido: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    pesoBruto: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    volumes: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    itensPorCaixa: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    gtin: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    gtinEmbalagem: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    tipoProducao: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    condicao: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    freteGratis: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    marca: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    descricaoComplementar: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    linkExterno: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    observacoes: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    descricaoEmbalagemDiscreta: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    categoria: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    estoque: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    actionEstoque: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    dimensoes: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    tributacao: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    midia: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    linhaProduto: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    estrutura: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    camposCustomizados: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    }
                }
            ]
        },
        params = {
            pagina: null,
            limite: null,
            criterio: null,
            tipo: 'T',
            idCategoria: null,
            idLoja: null,
            codigos: '',
            nome: '',
            idsProdutos: []
        },
        paramsSituacao = {
            idsProdutos: [],
            situacao: ''
        },
        idLoja = 0
    } = {}) {

        if (typeof id !== 'number' && id !== null) {
            throw new TypeError('O id deve ser um número ou null');
        }

        if (typeof nome !== 'string') {
            throw new TypeError('O nome deve ser uma string');
        }

        if (typeof codigo !== 'string') {
            throw new TypeError('O código deve ser uma string');
        }

        if (typeof preco !== 'number') {
            throw new TypeError('O preço deve ser um número');
        }

        if (typeof tipo !== 'string') {
            throw new TypeError('O tipo deve ser uma string');
        }

        if (typeof situacao !== 'string') {
            throw new TypeError('A situação deve ser uma string');
        }

        if (typeof formato !== 'string') {
            throw new TypeError('O formato deve ser uma string');
        }

        if (typeof descricaoCurta !== 'string') {
            throw new TypeError('A descrição curta deve ser uma string');
        }

        if (typeof imagemURL !== 'string') {
            throw new TypeError('A URL da imagem deve ser uma string');
        }

        if (typeof dataValidade !== 'string') {
            throw new TypeError('A data de validade deve ser uma string');
        }

        if (typeof unidade !== 'string') {
            throw new TypeError('A unidade deve ser uma string');
        }

        if (typeof gtin !== 'string') {
            throw new TypeError('O GTIN deve ser uma string');
        }

        if (typeof gtinEmbalagem !== 'string') {
            throw new TypeError('O GTIN da embalagem deve ser uma string');
        }

        if (typeof tipoProducao !== 'string') {
            throw new TypeError('O tipo de produção deve ser uma string');
        }

        if (typeof condicao !== 'number') {
            throw new TypeError('A condição deve ser um número');
        }

        if (typeof marca !== 'string') {
            throw new TypeError('A marca deve ser uma string');
        }

        if (typeof descricaoComplementar !== 'string') {
            throw new TypeError('A descrição complementar deve ser uma string');
        }

        if (typeof linkExterno !== 'string') {
            throw new TypeError('O link externo deve ser uma string');
        }

        if (typeof observacoes !== 'string') {
            throw new TypeError('As observações devem ser uma string');
        }

        if (typeof descricaoEmbalagemDiscreta !== 'string') {
            throw new TypeError('A descrição da embalagem discreta deve ser uma string');
        }
        if (typeof categoria !== 'object' || categoria === null || (typeof categoria.id !== 'number' && categoria.id !== null)) {
            throw new TypeError('A categoria deve ser um objeto com um ID numérico');
        }

        // Validando o objeto estoque
        if (
            typeof estoque !== 'object' ||
            estoque === null ||
            typeof estoque.minimo !== 'number' ||
            typeof estoque.maximo !== 'number' ||
            typeof estoque.crossdocking !== 'number' ||
            typeof estoque.localizacao !== 'string'
        ) {
            throw new TypeError('O objeto estoque deve conter os campos minimo, maximo, crossdocking e localizacao');
        }

        // Validando o objeto dimensoes
        if (
            typeof dimensoes !== 'object' ||
            dimensoes === null ||
            typeof dimensoes.largura !== 'number' ||
            typeof dimensoes.altura !== 'number' ||
            typeof dimensoes.profundidade !== 'number' ||
            typeof dimensoes.unidadeMedida !== 'number'
        ) {
            throw new TypeError('O objeto dimensoes deve conter os campos largura, altura, profundidade e unidadeMedida');
        }

        // Validando o objeto tributacao
        if (
            typeof tributacao !== 'object' ||
            tributacao === null ||
            typeof tributacao.origem !== 'number' ||
            typeof tributacao.percentualTributos !== 'number'
        ) {
            throw new TypeError('O objeto tributacao deve conter os campos origem e percentualTributos');
        }

        // // Validando o objeto midia
        // if (
        //   typeof midia !== 'object' ||
        //   midia === null ||
        //   typeof midia.video !== 'object' ||
        //   typeof midia.imagens !== 'object' ||
        //   !Array.isArray(midia.imagens.externas) ||
        //   !Array.isArray(midia.imagens.internas)
        // ) {
        //   throw new TypeError('O objeto midia deve conter os campos video e imagens, e imagens deve conter arrays externas e internas');
        //}

        // Validando o objeto linhaProduto
        if (typeof linhaProduto !== 'object' || linhaProduto === null || (typeof linhaProduto.id !== 'number' && linhaProduto.id !== null)) {
            throw new TypeError('O objeto linhaProduto deve ser um objeto com um ID numérico');
        }

        // Validando o objeto estrutura
        if (
            typeof estrutura !== 'object' ||
            estrutura === null ||
            typeof estrutura.tipoEstoque !== 'string' ||
            typeof estrutura.lancamentoEstoque !== 'string' ||
            !Array.isArray(estrutura.componentes)
        ) {
            throw new TypeError('O objeto estrutura deve conter os campos tipoEstoque, lancamentoEstoque e componentes');
        }

        // Validando o array de campos customizados
        if (!Array.isArray(camposCustomizados)) {
            throw new TypeError('Os campos customizados devem ser fornecidos como um array');
        }

        for (const campoCustomizado of camposCustomizados) {
            if (
                typeof campoCustomizado !== 'object' ||
                campoCustomizado === null ||
                typeof campoCustomizado.idCampoCustomizado !== 'number' ||
                typeof campoCustomizado.idVinculo !== 'string' ||
                typeof campoCustomizado.valor !== 'string' ||
                typeof campoCustomizado.item !== 'string'
            ) {
                throw new TypeError('Cada campo customizado deve ser um objeto com os campos idCampoCustomizado, idVinculo, valor e item');
            }
        }

        // Validando o array de variações
        if (!Array.isArray(variacoes)) {
            throw new TypeError('As variações devem ser fornecidas como um array');
        }

        super({ idLoja });
        this.id = id;
        this.nome = nome;
        this.codigo = codigo;
        this.preco = preco;
        this.tipo = tipo;
        this.situacao = situacao;
        this.formato = formato;
        this.descricaoCurta = descricaoCurta;
        this.imagemURL = imagemURL;
        this.dataValidade = dataValidade;
        this.unidade = unidade;
        this.pesoLiquido = pesoLiquido;
        this.pesoBruto = pesoBruto;
        this.volumes = volumes;
        this.itensPorCaixa = itensPorCaixa;
        this.gtin = gtin;
        this.gtinEmbalagem = gtinEmbalagem;
        this.tipoProducao = tipoProducao;
        this.condicao = condicao;
        this.freteGratis = freteGratis;
        this.marca = marca;
        this.descricaoComplementar = descricaoComplementar;
        this.linkExterno = linkExterno;
        this.observacoes = observacoes;
        this.descricaoEmbalagemDiscreta = descricaoEmbalagemDiscreta;
        this.categoria = categoria;
        this.estoque = estoque;
        this.actionEstoque = actionEstoque;
        this.dimensoes = dimensoes;
        this.tributacao = tributacao;
        this.midia = midia;
        this.linhaProduto = linhaProduto;
        this.estrutura = estrutura;
        this.camposCustomizados = camposCustomizados;
        this.variacoes = variacoes;
        this.payload = {
            nome: "",
            tipo: "P",
            situacao: "A",
            formato: "S",
            codigo: "",
            preco: 1,
            descricaoCurta: "",
            imagemURL: "",
            dataValidade: "",
            unidade: "UN",
            pesoLiquido: 1,
            pesoBruto: 1,
            volumes: 1,
            itensPorCaixa: 1,
            gtin: "",
            gtinEmbalagem: "",
            tipoProducao: "T",
            condicao: 0,
            freteGratis: false,
            marca: "",
            descricaoComplementar: "",
            linkExterno: "",
            observacoes: "Produto anunciado pelo hub de controle de estoque.",
            descricaoEmbalagemDiscreta: "",
            categoria: {
                id: 0
            },
            estoque: {
                minimo: 2,
                maximo: 100,
                crossdocking: 1,
                localizacao: ""
            },
            actionEstoque: "T",
            dimensoes: {
                largura: 1,
                altura: 1,
                profundidade: 1,
                unidadeMedida: 1
            },
            tributacao: {
                origem: 0,
                nFCI: "",
                ncm: "",
                cest: "",
                codigoListaServicos: "",
                spedTipoItem: "",
                codigoItem: "",
                percentualTributos: 0,
                valorBaseStRetencao: 0,
                valorStRetencao: 0,
                valorICMSSubstituto: 0,
                codigoExcecaoTipi: "",
                classeEnquadramentoIpi: "",
                valorIpiFixo: 0,
                codigoSeloIpi: "",
                valorPisFixo: 0,
                valorCofinsFixo: 0,
                codigoANP: "",
                descricaoANP: "",
                percentualGLP: 0,
                percentualGasNacional: 0,
                percentualGasImportado: 0,
                valorPartida: 0,
                tipoArmamento: 0,
                descricaoCompletaArmamento: "",
                dadosAdicionais: "",
                grupoProduto: {
                    value: "<Error: Too many levels of nesting to fake this schema>"
                }
            },
            midia: {
                video: {
                    value: "<Error: Too many levels of nesting to fake this schema>"
                },
                imagens: {
                    imagensURL: [
                        { link: "" }
                    ]
                }
            },
            linhaProduto: {
                id: 1
            },
            estrutura: {
                tipoEstoque: "F",
                lancamentoEstoque: "A",
                componentes: [
                    {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    }
                ]
            },
            // camposCustomizados: [
            //     {
            //         idCampoCustomizado: {
            //             value: "<Error: Too many levels of nesting to fake this schema>"
            //         },
            //         idVinculo: {
            //             value: "<Error: Too many levels of nesting to fake this schema>"
            //         },
            //         valor: {
            //             value: "<Error: Too many levels of nesting to fake this schema>"
            //         },
            //         item: {
            //             value: "<Error: Too many levels of nesting to fake this schema>"
            //         }
            //     },
            //     {
            //         idCampoCustomizado: {
            //             value: "<Error: Too many levels of nesting to fake this schema>"
            //         },
            //         idVinculo: {
            //             value: "<Error: Too many levels of nesting to fake this schema>"
            //         },
            //         valor: {
            //             value: "<Error: Too many levels of nesting to fake this schema>"
            //         },
            //         item: {
            //             value: "<Error: Too many levels of nesting to fake this schema>"
            //         }
            //     }
            // ],
            variacoes: [
                {
                    formato: "S",
                    nome: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    situacao: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    tipo: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    variacao: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    id: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    codigo: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    preco: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    descricaoCurta: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    imagemURL: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    dataValidade: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    unidade: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    pesoLiquido: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    pesoBruto: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    volumes: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    itensPorCaixa: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    gtin: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    gtinEmbalagem: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    tipoProducao: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    condicao: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    freteGratis: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    marca: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    descricaoComplementar: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    linkExterno: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    observacoes: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    descricaoEmbalagemDiscreta: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    categoria: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    estoque: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    actionEstoque: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    dimensoes: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    tributacao: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    midia: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    linhaProduto: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    estrutura: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    camposCustomizados: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    }
                },
                {
                    formato: "S",
                    nome: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    situacao: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    tipo: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    variacao: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    id: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    codigo: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    preco: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    descricaoCurta: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    imagemURL: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    dataValidade: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    unidade: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    pesoLiquido: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    pesoBruto: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    volumes: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    itensPorCaixa: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    gtin: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    gtinEmbalagem: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    tipoProducao: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    condicao: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    freteGratis: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    marca: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    descricaoComplementar: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    linkExterno: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    observacoes: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    descricaoEmbalagemDiscreta: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    categoria: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    estoque: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    actionEstoque: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    dimensoes: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    tributacao: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    midia: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    linhaProduto: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    estrutura: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    camposCustomizados: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    }
                }
            ],
            ...payload
        };
        this.params = params;
        this.paramsSituacao = paramsSituacao;
    }
    //////////////////////////////
    //METODOS DE COMUNICAÇÃO API//
    //////////////////////////////

    async getProduto() {
        console.log('Iniciando método `getProduto`');
    
        const endpoint = '/produtos';
        let url = baseUrl + endpoint;
        let queryString = this.buildQueryString(this.params);
        if (queryString) {
            url += '?' + queryString;
        }
        console.log('URL construída para a requisição:', url);
    
        let accessToken = await this.getBling();
        if (!accessToken || Object.keys(accessToken).length === 0) {
            console.warn('Nenhum token de acesso foi encontrado para as empresas.');
            return null; // Retorna caso não existam tokens
        }
        console.log('Tokens de acesso obtidos:', accessToken);
    
        try {
            console.log('Criando requisições para todas as empresas...');
            let requests = Object.keys(accessToken).map(id => {
                const blingInfo = accessToken[id];
                console.log(`Configuração da requisição para a empresa "${blingInfo.name}" com ID "${blingInfo.id}"`);
                return fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${blingInfo.access_token}`
                    }
                });
            });
    
            console.log('Enviando requisições para as APIs...');
            let responses = await Promise.all(requests);
    
            let result = {};
            for (let i = 0; i < responses.length; i++) {
                console.log(`Processando resposta ${i + 1} de ${responses.length}...`);
                let response = await responses[i].text();
    
                try {
                    console.log(`Parseando resposta ${i + 1}:`, response);
                    response = JSON.parse(response);
                } catch (e) {
                    console.error(`Erro ao parsear resposta ${i + 1}:`, response);
                    console.warn('A resposta não pôde ser interpretada como JSON. Pulando esta resposta.');
                    continue;
                }
    
                let blingInfo = accessToken[Object.keys(accessToken)[i]];
    
                if (response.data && response.data.length > 0) {
                    console.log(`Dados encontrados para a empresa "${blingInfo.name}" (ID: ${blingInfo.id}):`, response.data);
                    result[blingInfo.name] = {
                        id: blingInfo.id,
                        empresa: blingInfo.name,
                        dataHora: new Date().toISOString(),
                        method: 'getProduto',
                        request: response.data
                    };
                } else {
                    console.warn(`Nenhum dado foi retornado para a empresa "${blingInfo.name}" (ID: ${blingInfo.id}).`);
                }
            }
    
            console.log('Todas as respostas foram processadas. Resultado final:', result);
            return result;
    
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            return null;
        }
    }
    

    async getProdutoById(idProduto) {
        const endpoint = `/produtos/${idProduto}`;
        let url = baseUrl + endpoint;
        console.log('URL:', url);
        let accessToken = await this.getBling();
        console.log('Access Token:', accessToken);

        try {
            let requests = Object.keys(accessToken).map(id => {
                const blingInfo = accessToken[id];
                console.log('Bling Info: ', blingInfo);
                return fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${blingInfo.access_token}`
                    }
                });
            });

            console.log('REQUESTS: ', requests);

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

                if (response.data) {

                    result[blingInfo.name] = {
                        id: blingInfo.id,
                        empresa: blingInfo.name,
                        dataHora: new Date().toISOString(),
                        method: 'getProdutoById',
                        request: response.data
                    };
                }
            }
            return result;
        } catch (error) {
            console.error('Erro ao buscar produto por ID:', error);
            return null;
        }
    }

    //metodo para criar um produto, recebe o payload
    async createProduct() {
        const endpoint = '/produtos';
        let url = baseUrl + endpoint;

        console.log('URL:', url);

        let accessToken = await this.getBling();
        console.log('Access Token:', accessToken);

        try {
            let requests = Object.keys(accessToken).map(id => {
                const blingInfo = accessToken[id];
                console.log('Bling Info: ', blingInfo);
                return fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${blingInfo.access_token}`
                    },
                    body: JSON.stringify(this.payload),
                    muteHttpExceptions: true
                });
            });

            console.log('REQUESTS: ', requests);

            let responses = await Promise.all(requests);

            let result = {};
            for (let i = 0; i < responses.length; i++) {
                let response = await responses[i].text();
                try {
                    response = JSON.parse(response);
                    console.log("response: ", response)
                } catch (error) {
                    console.error(`Erro ao parsear resposta do servidor ${i}:`, response);
                    continue;
                }

                let blingInfo = accessToken[Object.keys(accessToken)[i]];
                if (response.error) {
                    result[blingInfo.name] = {
                        id: blingInfo.id,
                        empresa: blingInfo.name,
                        dataHora: new Date().toISOString(),
                        method: 'createProduct',
                        error: response.error
                    }
                    console.error(response.error)
                }
                if (response.data) {
                    result[blingInfo.name] = {
                        id: blingInfo.id,
                        empresa: blingInfo.name,
                        dataHora: new Date().toISOString(),
                        method: 'createProduct',
                        request: response.data
                    };
                }
            }
            return result;
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            return null;
        }
    }

    //metodo para alterar um produto, recebe o id e o payload
    async altProduct(idProduto) {
        const endpoint = `/produtos/${idProduto}`;
        let url = baseUrl + endpoint;

        console.log('URL:', url);

        let accessToken = await this.getBling();
        console.log('Access Token:', accessToken);

        try {
            let requests = Object.keys(accessToken).map(id => {
                const blingInfo = accessToken[id];
                console.log('Bling Info: ', blingInfo);
                return fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${blingInfo.access_token}`
                    },
                    body: JSON.stringify(this.payload),
                });
            });

            console.log('REQUESTS: ', requests);

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

                if (response.data) {
                    result[blingInfo.name] = {
                        id: blingInfo.id,
                        empresa: blingInfo.name,
                        dataHora: new Date().toISOString(),
                        method: 'altProduct',
                        request: response.data
                    };
                }
            }
            return result;
        } catch (error) {
            console.error('Erro ao alterar produto:', error);
            return null;
        }
    }


    //metodo para alterar situacao de um produto, recebe id e situacao
    async altProductSituation() {
        const endpoint = '/produtos/situacoes';
        let url = baseUrl + endpoint;

        let payload = {
            idsProdutos: this.paramsSituacao.idsProdutos,
            situacao: this.situacao
        };

        console.log('URL:', url);
        console.log('Payload:', payload);

        let accessToken = await this.getBling();
        console.log('Access Token:', accessToken);

        try {
            let requests = Object.keys(accessToken).map(id => {
                const blingInfo = accessToken[id];
                console.log('Bling Info: ', blingInfo);
                return fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${blingInfo.access_token}`
                    },
                    body: JSON.stringify(payload),
                    muteHttpExceptions: true
                });
            });

            console.log('REQUESTS: ', requests);

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

                if (response.data) {
                    result[blingInfo.nome] = {
                        id: blingInfo.idLoja,
                        empresa: blingInfo.nome,
                        dataHora: new Date().toISOString(),
                        method: 'altProductSituation',
                        request: response.data
                    };
                }
            }
            return result;
        } catch (error) {
            console.error('Erro ao alterar situação do produto:', error);
            return null;
        }
    }

}

export async function deletarProduto(sku) {
    try {
        await deleteProduct(sku);
        console.log(`Produto deletado com sucesso: ${sku}`)
    } catch (error) {
        console.error(`Erro ao deletar o produto: ${sku}`)
    }
}

export async function getAllProduct() {
    try {
        console.log('funcao pegar todos os produtos')
        return await getAllProducts();
    } catch (error) {
        console.error('Erro ao pegar os produtos: ', error.message);
        return null
    }
}

export async function getProducto(sku) {
    try {
        return await getProduct(sku);
    } catch (error) {
        console.error('Erro ao pegar o produto: ', error.message);
        return null
    }
}

export async function pegarIdBySku(sku) {
    try {
        const ids = await getProductIdsBySku(sku);
        return ids
    } catch (error) {
        console.log('Erro ao pegar id dos produtos: ', error.message)
    }
}


export async function atualizarTodosProdutos() {
    const produtos = await getAllProduct();
    console.log("Quantidade de produtos: ", produtos.length);

    for (const produto of produtos) {
        console.log(produto);
        
        const idsExistentes = await getProductIdsBySku(produto.sku);

        // Obtém a categoria do produto
        const categoria = await getCategory(produto.category);
        console.log('Categoria do produto: ', categoria);

        if (categoria) {
            // Monta o payload do produto
            const product = new Produto({
                payload: {
                    nome: produto.name,
                    codigo: produto.sku, // Código original
                    tipo: "P",
                    situacao: "A",
                    formato: "S",
                    gtin: produto.ean,
                    marca: produto.brand,
                    preco: produto.price,
                    descricaoCurta: produto.description,
                    tributacao: {
                        ncm: categoria.ncm,
                        cest: categoria.cest
                    },
                    midia: {
                        imagens: {
                            imagensURL: [
                                {
                                    link: produto.imageUrl
                                }
                            ]
                        }
                    }
                }
            });

            console.log('Produto para subir: ', product.payload);

            let produtoCriado;

            if (idsExistentes.length > 0) {
                for (const idProduto of idsExistentes) {
                    // Se o produto já existe, atualiza o produto existente
                    produtoCriado = await product.altProduct(idProduto);
                    console.log('Produto atualizado: ', produtoCriado);
                }
            } else {
                // Se o produto não existe, cria um novo produto
                produtoCriado = await product.createProduct();
                console.log('Produto criado: ', produtoCriado);
            }

            await sleep(300);

            await pegarIdsProdutoBySku(produto.sku);

            if (produtoCriado) {
                console.log('Colocando estoque para o produto: ');
                await novoEstoque(product.payload.codigo, produto.quantity);
            }

            console.log('Exibindo o produto criado/atualizado, última etapa do processo: ', produtoCriado);
        } else {
            console.log("Produto sem categoria!")
        }
        await sleep(1500);
    }
}


export async function criarProduto(produto) {

    await createProduct(produto);
    // Obtém a categoria do produto
    const categoria = await getCategory(produto.category);
    console.log('Categoria do produto: ', categoria);

    // Monta o payload do produto
    const product = new Produto({
        payload: {
            nome: produto.name,
            codigo: produto.sku,
            tipo: "P",
            situacao: "A",
            formato: "S",
            gtin: produto.ean,
            imagemURL: produto.imageUrl,
            marca: produto.brand,
            preco: produto.price,
            descricaoCurta: produto.description,
            tributacao: {
                ncm: categoria.ncm,
                cest: categoria.cest
            },
            midia: {
                imagens: {
                    imagensURL: [
                        {
                            link: produto.imageUrl
                        }
                    ]
                }
            }
        }
    });

    console.log('Produto para subir: ', product.payload);

    let produtoCriado;
    while (true) {
        const idsExistentes = await getProductIdsBySku(produto.sku);
        console.log('Quantidade de IDs encontrados: ', idsExistentes.length);
        if (idsExistentes.length >= 3) {
            for (const idProduto of idsExistentes) {
    
                // Se o produto já existe, atualiza o produto existente
                // Assume que usa o primeiro ID encontrado
                produtoCriado = await product.altProduct(idProduto);
                console.log('Produto atualizado: ', produtoCriado);
            }
            break;
        } else {
            // Se o produto não existe, cria um novo produto
            produtoCriado = await product.createProduct();
            console.log('Produto criado: ', produtoCriado);
            await pegarIdsProdutoBySku(produto.sku);
        }
    }
    

    await sleep(300);
    await pegarIdsProdutoBySku(produto.sku);

    if (produtoCriado) {
        console.log('Colocando estoque para o produto: ');
        await novoEstoque(product.payload.codigo, produto.quantity, produto.price);
    }

    console.log('Exibindo o produto criado/atualizado, última etapa do processo: ', produtoCriado);
}

// export async function criarProdutoComposição(produto) {

//     const idsExistentes = await getProductIdsBySkus(produto.sku);
//     console.log('ids existentes: ', idsExistentes)
//     // Obtém a categoria do produto
//     const categoria = await getCategory(produto.category);
//     console.log('Categoria do produto: ', categoria);

//     // Monta o payload do produto
//     const product = new Produto({
//         payload: {
//             nome: produto.name,
//             codigo: produto.sku,
//             tipo: "P",
//             situacao: "A",
//             formato: "S",
//             gtin: produto.ean,
//             marca: produto.brand,
//             preco: produto.price,
//             descricaoCurta: produto.description,
//             tributacao: {
//                 ncm: categoria.ncm,
//                 cest: categoria.cest
//             },
//             midia: {
//                 imagens: {
//                     externas: [
//                         {
//                             link: produto.imageUrl
//                         }
//                     ]
//                 }
//             }
//         }
//     });

//     console.log('Produto para subir: ', product.payload);

//     let produtoCriado;

//     if (idsExistentes.length > 0) {
//         for (const idProduto of idsExistentes) {

//             // Se o produto já existe, atualiza o produto existente
//             // Assume que usa o primeiro ID encontrado
//             produtoCriado = await product.altProduct(idProduto);
//             console.log('Produto atualizado: ', produtoCriado);
//         }
//     } else {
//         // Se o produto não existe, cria um novo produto
//         produtoCriado = await product.createProduct();
//         console.log('Produto criado: ', produtoCriado);
//     }

//     await sleep(300);
//     await pegarIdsProdutoBySku(produto.sku);

//     if (produtoCriado) {
//         console.log('Colocando estoque para o produto: ');
//         await novoEstoque(product.payload.codigo, produto.quantity);
//     }

//     console.log('Exibindo o produto criado/atualizado, última etapa do processo: ', produtoCriado);
// }

// export async function criarProduto(produto) {

//     await createProduct(produto);
//     const categoria = await getCategory(produto.category)
//     console.log('categoria do produto: ',categoria)

//     console.log('Produto para subir: ', produto)

//     const product = new Produto({
//         payload: {
//             nome: produto.name,
//             codigo: produto.sku,
//             tipo: "P",
//             situacao: "A",
//             formato: "S",
//             gtin: produto.ean,
//             marca: produto.brand,
//             preco: produto.price,
//             descricaoCurta: produto.description,
//             tributacao: {
//                 ncm: categoria.ncm,
//                 cest: categoria.cest
//             },
//             midia: {
//                 imagens: {
//                     externas: [
//                         {
//                             link: produto.imageUrl
//                         }
//                     ]
//                 }
//             }
//         }
//     })

//     console.log('Produto para subir: ', product.payload)

//     const produtoCriado = await product.createProduct();
//     console.log(produtoCriado)

//     await sleep(300)
//     await pegarIdsProdutoBySku(produto.sku)

//     if (produtoCriado) {
//         console.log('Colocando estoque para o produto: ')
//         await novoEstoque(product.payload.codigo, produto.quantity)
//     }
//     console.log('exibindo o produto criado, ultima etapa do processo: ', produtoCriado);
// }

async function pegarIdsProdutoBySku(sku) {
    console.log("Pegando ID dos produtos");

    try {
        const produto = new Produto({ params: { codigo: sku } });
        console.log('Criando o objeto para buscar o produto');
        const produtos = await produto.getProduto();

        // Verifica se o objeto `produtos` possui chaves e não é nulo ou indefinido
        if (!produtos || Object.keys(produtos).length === 0) {
            console.warn('Nenhum produto encontrado para o SKU fornecido:', sku);
            return; // Encerra a execução caso `produtos` esteja vazio ou inválido
        }

        console.log('Produto encontrado:', produtos);
        await sleep(1000);
        console.log('Aplicando intervalo');

        for (const chave in produtos) {
            if (produtos.hasOwnProperty(chave)) {
                const bling = produtos[chave];
                if (bling.request && bling.request.length > 0) {
                    const productData = {
                        requestCode: bling.request[0].codigo,
                        requestId: bling.request[0].id,
                        chave: chave,
                        id: bling.id
                    };

                    await setProductId(bling.request[0].codigo, bling.request[0].id, productData);

                    console.log('Informações do produto salvas no Firebase:', productData);
                }
            }
        }

        console.log('Todos os produtos foram salvos no Firebase com sucesso!');
    } catch (error) {
        console.error('Erro ao buscar e salvar produtos:', error);
    }
}



function verificarProduto(sku) {
    const lastRow = sheetProduto.getLastRow();
    const produtosData = sheetProduto.getRange(2, 1, lastRow - 1, 10).getValues();

    for (let i = 0; i < produtosData.length; i++) {
        let produto = produtosData[i];
        for (let j = 0; j < produto.length; j++) {
            if ((j === 0 || j === 1 || j === 2 || j === 3 || j === 4 || j === 5) && (produto[j] === '' || produto[j] === null || produto[j] === undefined)) {
                throw new Error('Dados incompletos na linha ' + (i + 2) + ', coluna ' + (j + 1));
            }
        }
    }

    let produtos = pegarTodosProdutos();
    let produtoNaoEncontrado = [];
    let produtoEncontrado = produtos.find(produto => produto.sku === sku);

    if (produtoEncontrado) {
        if (!produtoEncontrado.qtd || produtoEncontrado.qtd === 0 || produtoEncontrado.qtd < 0) {
            console.log('ruptura(produtoEncontrado)')
            throw new Error('Quantidade de produto inválida ou estoque zerado' + produtoEncontrado.sku)
        }
    } else {
        produtoNaoEncontrado.push({ sku: sku });
    }

    if (produtoNaoEncontrado.length <= 0) {
        return true
    } else {
        var msg = 'Alguns produtos não foram encontrados:'
        produtoNaoEncontrado.forEach(produto => {
            msg += '\nID do produto: ' + produto.sku;
        })
        throw new Error(msg)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('testButto').addEventListener('click', async () => {
        try {
            // const produtos = await getAllProduct()
            // //console.log('produtos para cadastrar: ', produtos)

            // for (const produto of produtos) {
            //     console.log(produto.sku)
            //     await sleep(1000)
            //     await pegarIdsProdutoBySku(produto.sku)
            //     await sleep(1000)
            // }
            // const sku = document.getElementById('parametro-funca').value
            // console.log("produto a ser processado: ", sku)
            // console.log('sku do produto a ser encontrado: ', sku)

            // console.log('Operação finalizada');

            await atualizarTodosProdutos();
        } catch (error) {
            console.log("Erro ao pegar produtos: ", error)
        }
    })
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}