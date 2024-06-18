const baseUrl = 'http://localhost:3000/api'

class Produto extends BaseClass {
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
                    value: "<Error: Too many levels of nesting to fake this schema>"
                },
                imagens: {
                    externas: [
                        { link: '' }
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
            camposCustomizados: [
                {
                    idCampoCustomizado: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    idVinculo: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    valor: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    item: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    }
                },
                {
                    idCampoCustomizado: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    idVinculo: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    valor: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    item: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    }
                }
            ],
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
            codigo: '',
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
                    externas: [
                        { link: '' }
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
            camposCustomizados: [
                {
                    idCampoCustomizado: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    idVinculo: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    valor: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    item: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    }
                },
                {
                    idCampoCustomizado: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    idVinculo: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    valor: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    },
                    item: {
                        value: "<Error: Too many levels of nesting to fake this schema>"
                    }
                }
            ],
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

    getProduto() {
        const endpoint = '/produtos';
        let url = baseUrl + endpoint;
        let queryString = this.buildQueryString(this.params)
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
            };
            let responses = UrlFetchApp.fetchAll(requests);
            let result = {};
            for (let i = 0; i < responses.length; i++) {
                let response = JSON.parse(responses[i].getContentText());
                let blingInfo = accessToken[i];

                result[blingInfo.nome] = {
                    id: blingInfo.idLoja,
                    empresa: blingInfo.nome,
                    dataHora: dataHora,
                    method: 'getProduto',
                    request: response.data
                };
            };
            return result;
        } catch (error) {
            console.error('Erro gerado: ', error.stack);
            return null;
        };
    };

    getProdutoById(idProduto) {
        const endpoint = `/produtos/${idProduto}`
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

                result[blingInfo.nome] = {
                    id: blingInfo.idLoja,
                    empresa: blingInfo.nome,
                    dataHora: dataHora,
                    method: 'getProdutoById',
                    request: response.data
                };
            }
            return result;
        } catch (erro) {
            console.error('Erro gerado: ', erro.stack);
        };
    };

    //metodo para criar um produto, recebe o payload
    createProduct() {
        const endpoint = '/produtos';
        let url = baseUrl + endpoint;

        let accessToken = this.getBling();

        try {
            let requests = [];
            for (let id in accessToken) {
                const blingInfo = accessToken[id];

                let request = {
                    'url': url,
                    'method': 'post',
                    'payload': this.payload,
                    'headers': {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Bearer ${blingInfo.accessToken}`
                    },
                    'muteHttpExceptions': true
                };
                console.log('request: ', request)
                requests.push(request);
            }

            let responses = UrlFetchApp.fetchAll(requests);
            let result = {};
            for (let i = 0; i < responses.length; i++) {
                let response = JSON.parse(responses[i].getContentText());
                let blingInfo = accessToken[i];

                console.log('response: ', response)

                result[blingInfo.nome] = {
                    id: blingInfo.idLoja,
                    empresa: blingInfo.nome,
                    dataHora: dataHora,
                    method: 'createProduct',
                    request: response.data
                };
            }
            return result;
        } catch (erro) {
            console.error('Erro gerado: ', erro.stack);
            console.log(erro.fields);
        }
    }

    //metodo para alterar um produto, recebe o id e o payload
    altProduct(idProduto) {
        const endpoint = `/produtos/${idProduto}`;
        let url = baseUrl + endpoint;
        let accessToken = this.getBling();

        try {
            let requests = [];
            for (let id in accessToken) {
                const blingInfo = accessToken[id];
                let request = {
                    'url': url,
                    'method': 'put',
                    'payload': this.payload,
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

                result[blingInfo.nome] = {
                    id: blingInfo.idLoja,
                    empresa: blingInfo.nome,
                    dataHora: dataHora,
                    method: 'altProduct',
                    request: response.data
                };
            };
            return result;
        } catch (erro) {
            console.error('Erro gerado: ', erro.stack);
        };
    };

    //metodo para alterar situacao de um produto, recebe id e situacao
    altProductSituation() {
        const endpoint = '/produtos/situacoes';
        let url = baseUrl + endpoint;
        let payload = {
            idsProdutos: this.paramsSituacao.idsProdutos,
            situacao: this.situacao
        }
        try {
            let options = {
                'method': 'put',
                'payload': payload,
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${this.getBling().accessToken}`
                },
                'muteHttpExceptions': true
            };
            let reqs = UrlFetchApp.fetch(url, options);
            let ress = JSON.parse(reqs.getContentText());
            return ress;
        } catch (erro) {
            console.error('Erro gerado: ', erro.stack);
        }
    }
}