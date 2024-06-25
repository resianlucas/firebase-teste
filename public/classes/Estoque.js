import Deposito from './Deposito.js';
import { BaseClass } from './BaseClass.js';


const baseUrl = 'http://localhost:3000/api'

export default class Estoque extends BaseClass {
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

function pegarEstoqueAtualizado() {
    const produtos = pegarTodosProdutos();
    const estoques = produtos.map(produto => ({
      sku: produto.sku,
      qtd: produto.qtd
    }));
    return estoques;
  };
  
  //////////////OK/////////////////////
  function pegarTodosEstoques() {
    const estoques = pegarEstoqueAtualizado();
    const dados = estoques.map(produto => ([produto.sku, produto.qtd]))
    sheetEstoque.getRange(2, 1, dados.length, dados[0].length).setValues(dados);
  };
  
  //////////////OK/////////////////////
  function pegarEstoque() {
    const lastRow = sheetEstoque.getLastRow();
    const consulta = sheetEstoque.getRange(2, 1, lastRow - 1).getValues();
    const estoques = pegarEstoqueAtualizado();
    consulta.forEach((prod, index) => {
      const produto = estoques.find(produto => produto.sku === prod[0]);
      sheetEstoque.getRange(index + 2, 2).setValue(produto.qtd);
    });
  };
  
  // function showDialog() {
  //   const htmlOutput = HtmlService.createHtmlOutputFromFile('index')
  //       .setWidth(400)
  //       .setHeight(300);
  //   SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Atualizar Estoque');
  // }
  
  // function atualizarEstoque() {
  //   const lastRow = sheetEstoque.getLastRow();
  //   const consultaData = sheetEstoque.getRange(2, 1, lastRow - 1, 2).getValues();
  //   const produtos = pegarEstoqueAtualizado();
  
  //   const consulta = consultaData.map(prod => ({
  //     sku: prod[0],
  //     qtd: prod[1]
  //   }));
  
  //   let produtosParaAtualizar = [];
  //   consulta.forEach(prod => {
  //     const produtoEncontrado = produtos.find(produto => produto.sku === prod.sku);
  //     if (produtoEncontrado) {
  //       produtosParaAtualizar.push({
  //         sku: produtoEncontrado.sku,
  //         atual: produtoEncontrado.qtd,
  //         novo: prod.qtd
  //       });
  //     }
  //   });
  
  //   const html = HtmlService.createHtmlOutputFromFile('index')
  //       .setWidth(400)
  //       .setHeight(300)
  //       .append('<script>renderProdutos(' + JSON.stringify(produtosParaAtualizar) + ')</script>');
  //   SpreadsheetApp.getUi().showModalDialog(html, 'Atualizar Estoque');
  // }
  
  // function onOpen() {
  //   const ui = SpreadsheetApp.getUi();
  //   ui.createMenu('Custom Menu')
  //       .addItem('Atualizar Estoque', 'showDialog')
  //       .addToUi();
  // }
  
  
  
  //////////////OK/////////////////////
  function atualizarEstoque() {
    const lastRow = sheetEstoque.getLastRow();
    const consultaData = sheetEstoque.getRange(2, 1, lastRow - 1, 2).getValues();
    const produtos = pegarEstoqueAtualizado();
    const consulta = consultaData.map(prod => ({
      sku: prod[0],
      qtd: prod[1]
    }));
  
    let mensagem = 'Os seguintes produtos serão atualizados:\n\n';
    consulta.forEach(prod => {
      const produtoEncontrado = produtos.find(produto => produto.sku === prod.sku);
      if (produtoEncontrado) {
        mensagem += `${produtoEncontrado.sku}\nstock atual: ${produtoEncontrado.qtd}\nnew stock: ${prod.qtd}\n\n`;
      } else {
        mensagem += `Produto não encontrado: ${prod.sku}\n\n`;
      }
    });
    //const resposta = Browser.msgBox(mensagem + 'Deseja atualizar todos os produtos?', Browser.Buttons.YES_NO);
    const resposta = 'YES'
    if (resposta.toUpperCase() === 'YES') {
      consulta.forEach(prod => {
        const produtoEncontrado = produtos.find(produto => produto.sku === prod.sku);
        if (produtoEncontrado) {
          atualizarEstoqueAtualizado(produtoEncontrado.sku, prod.qtd);
        }
      });
      Browser.msgBox('Todos os estoques foram atualizados');
    } else {
      Browser.msgBox('Nenhum estoque foi atualizado');
    }
  };
  
  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  
  /*
  atualizar os estoques no bling
  baseado no estoque dos produtos na planilha
  */
  
  //////////////OK/////////////////////
  
  /*
  atualizar os estoques na planilha
  baseado no estoque dos produtos no bling
  */
  
  function atualizarEstoqueProduto() {
    const lastRow = sheetProduto.getLastRow();
    const produtos = sheetProduto.getRange(2, 1, lastRow - 1, 10).getValues();
    const estoques = [];
    try {
      produtos.forEach(prod => {
        const id = prod[0]
  
        const estoque = new Estoque({
          params: {
            idsProdutos: [id]
          }
        })
        var aux = getEstoque(estoque.params);
        estoques.push(aux);
      })
      for (i = 0; i < estoques.length; i++) {
        var qtd = estoques[i].data[0].saldoFisicoTotal;
        sheetProduto.getRange(i + 2, 10).setValue(qtd);
      }
    } catch (erro) {
      console.error('Erro ao atualizar estoque na planilha:', erro);
    }
  }
  
  //alem de pedir o id, pedir tambem o sku para verificacao na tabela de produtos do hub
  export async function lancarEstoqueByPedidoVenda(idPedidoVenda, idLoja) {
  
    const pedid = new PedidoVenda({
      idLoja: idLoja
    });
  
    //registrarPedidos(idPedidoVenda, idLoja, 'processando');
  
    // const produtos = pegarEstoqueAtualizado();
    // const estoques = [];
  
  
    // COLETA DO PEDIDO
    const pedido = await pedid.getPedidoVendaById(idPedidoVenda);
  
    console.log('Pedido Unitário: ', pedido)
  
    // VERIFICAR SE É UM PEDIDO VÁLIDO
    //verificarPedido(idPedidoVenda, idLoja);
  
    const empresa = Object.keys(pedido);
  
    let itensPedido = pedido[empresa].request.itens;
    console.log('itens pedido: ', itensPedido);
  
    for (const item of itensPedido) {
    }
    
    
    const updates = {};
    let operacaoInvalida = false;
    
    for (const item of itensPedido) {
  
      const id = item.produto.id;
      const produto = new Produto({
        idLoja: idLoja
      });
      const prod = await produto.getProdutoById(id);
      console.log('Produto: ', prod[empresa].request.estrutura.componentes[0].produto.id)
      const produtoMestre = await produto.getProdutoById(prod[empresa].request.estrutura.componentes[0].produto.id)
      console.log('Produto mestre: ', produtoMestre)
  
      const sku = produtoMestre[empresa].request.codigo; // ajuste para corresponder ao campo correto em seu objeto de item
      const quantidadeSolicitada = item.quantidade; // ajuste para corresponder ao campo correto em seu objeto de item
      const productRef = ref(db, `products/${sku}`);
      const productSnapshot = await get(productRef);
  
      if (productSnapshot.exists()) {
        const quantidadeAtual = productSnapshot.val().quantity || 0;
        const novaQuantidade = quantidadeAtual - quantidadeSolicitada; // Supondo que você queira adicionar a quantidade solicitada ao estoque atual
  
        if (novaQuantidade < 0) {
          console.error(`Operação inválida: quantidade negativa não permitida para SKU: ${sku}. Estoque atual: ${quantidadeAtual}, Quantidade solicitada: ${quantidadeSolicitada}`);
          operacaoInvalida = true;
          break; // Interrompe o loop se encontrar uma quantidade negativa
        }
  
        updates[`/products/${sku}/quantity`] = novaQuantidade;
      } else {
        console.error(`Produto com SKU: ${sku} não encontrado.`);
        operacaoInvalida = true;
        break; // Interrompe o loop se o produto não for encontrado
      }
    }
  
    if (!operacaoInvalida) {
      try {
        console.log(`Atualizando quantidades no Firebase:`, updates);
        await update(ref(db), updates);
        console.log('Estoque atualizado com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar estoque:', error);
      }
    } else {
      console.error('A operação foi cancelada devido a uma validação inválida.');
    }
  
  
    
    // VERIFICAR SE PRODUTOS ESTÃO CADASTRADOS
    //var verificador = verificarPedido(idPedidoVenda, idLoja);
  
    // if (verificador) {
    //   itensPedido.forEach(item => {
    //     const estoque = {
    //       sku: item.codigo,
    //       nome: item.descricao,
    //       qtd: item.quantidade
    //     }
    //     estoques.push(estoque);
    //   });
  
    //   //VERIFICA ESTOQUE NA TABELA
    //   // estoques.forEach(estoque => {
    //   //   var produtoEncontrado = produtos.find(produto => produto.sku === estoque.sku);
    //   //   if (produtoEncontrado) {
    //   //     var novaQuantidade = produtoEncontrado.qtd - estoque.qtd;
    //   //     if (novaQuantidade < 0) {
    //   //       ruptura(produtoEncontrado);
    //   //       throw new Error('Estoque insuficiente para atender ao pedido\n Produto: ' + produtoEncontrado.sku);
    //   //     }
    //   //   }
    //   // });
  
    //   //ATUALIZA ESTOQUE NA TABELA
    //   estoques.forEach(estoque => {
    //     var produtoEncontrado = produtos.find(produto => produto.sku === estoque.sku);
    //     if (produtoEncontrado) {
    //       var novaQuantidade = produtoEncontrado.qtd - estoque.qtd;
  
    //       if (novaQuantidade < 0) {
    //         ruptura(produtoEncontrado);
    //         throw new Error('Estoque insuficiente para atender ao pedido\n Produto: ' + produtoEncontrado.sku);
    //       }
    //       atualizarEstoqueAtualizado(produtoEncontrado.sku, novaQuantidade);
    //     }
    //   });
  
  
    //   // LOG DE PEDIDOS PROCESSADOS
    //   registrarPedidos(idPedidoVenda, idLoja, 'finalizado');
  
    //   //return //Browser.msgBox('Tabela atualizada');
    // } else {
    //   return Browser.msgBox('Não foi possível completar a execução');
    // }
  }
  
  function atualizarEstoqueAtualizado(sku = 'Oleo Doce 100ml', quantidade = 8) {
    const produtos = pegarTodosProdutos();
    const produto = produtos.find(produto => produto.sku === sku);
    if (produto) {
      var linha = produtos.indexOf(produto) + 2;
      sheetProduto.getRange(linha, 9).setValue(quantidade);
    };
  
    const id = pegarIdBySku(sku);
    id.forEach(produto => {
      const operacao = 'B';
      const deposito = new Deposito({
        idLoja: produto.idLoja
      });
      const depositoData = deposito.getDeposito();
      const idDeposito = depositoData.request.id;
  
      const estoque = new Estoque({
        produto: { id: produto.id },
        operacao: operacao,
        depositos: { id: idDeposito },
        quantidade: quantidade,
        idLoja: produto.idLoja
      });
      try {
        estoque.createEstoque();
        console.log('produto atualizado');
      } catch (error) {
        console.error('Erro ao atualizar estoque no Bling:', error);
      };
    });
  };
  
  // document.addEventListener('DOMContentLoaded', () => {
  //   document.getElementById('testButton').addEventListener('click', async () => {
  
  //     const idLoja = document.getElementById('parametro-funcao').value
  //     const quantidade = document.getElementById('parametro-quantidade').value
  //     const deposito = new Deposito({
  //       idLoja: idLoja
  //     })
  
  //     const depositos = await deposito.getDeposito();
  //     const idDeposito = Object.values(depositos).map(deposito => deposito.request.id);
  
  //     for (const id of idDeposito) {
  //       const estoque = new Estoque({
  //         produto: {
  //           id: 16239460759
  //         },
  //         depositos: {
  //           id: id
  //         },
  //         operacao: 'B',
  //         quantidade: parseFloat(quantidade),
  //         idLoja: idLoja
  //       })
  //       const result = await estoque.createEstoque();
  //       console.log('Result:', result);
  //     }
  //   });
  // });