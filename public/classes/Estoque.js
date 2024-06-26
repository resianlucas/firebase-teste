import Deposito from './Deposito.js';
import { BaseClass } from './BaseClass.js';
import { updateEstoque, createEstoque } from '../database/estoque.js';
import { pegarIdBySku, getAllProduct } from './Produto.js';

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

export async function pegarEstoque() {
  const produtos = await getAllProduct();
  const estoques = produtos.map(produto => ({
    sku: produto.sku,
    qtd: produto.qtd
  }));
  return estoques;
}

export async function atualizarEstoque(sku, quantidade) {
  await updateEstoque(sku, quantidade)

  const ids = await pegarIdBySku(sku)
  console.log('ids encontrados: ', ids)

  const deposito = new Deposito()
  const depositos = await deposito.getDeposito();
  const idDeposito = Object.values(depositos).map(deposito => deposito.request.id);

  for (const id of idDeposito) {
    for (const idProd of ids) {
      const estoque = new Estoque({
        produto: {
          id: idProd
        },
        depositos: {
          id: id
        },
        operacao: 'B',
        quantidade: parseInt(quantidade.replace(/[^0-9]/g, ''), 10)
      })
      const result = await estoque.createEstoque();
      console.log('Result:', result);
    }
  }

}

export async function novoEstoque(sku, quantidade) {
  try {
    await createEstoque(sku, quantidade);
    console.log(`Estoque criado/atualizado para SKU: ${sku} com quantidade: ${quantidade}`);

    const ids = await pegarIdBySku(sku);
    console.log(`IDs encontrados para SKU: ${sku} -> ${JSON.stringify(ids)}`);

    const deposito = new Deposito();
    const depositos = await deposito.getDeposito();
    console.log(`Depósitos obtidos: ${JSON.stringify(depositos)}`);

    const idDeposito = Object.values(depositos).map(deposito => deposito.request.id);
    console.log(`IDs de depósitos: ${JSON.stringify(idDeposito)}`);

    console.log('Atualização de estoque concluída com sucesso.');

    for (const id of idDeposito) {
      for (const idProd of ids) {
        const estoque = new Estoque({
          produto: {
            id: parseInt(idProd)
          },
          depositos: {
            id: id
          },
          operacao: 'B',
          quantidade: parseInt(quantidade.replace(/[^0-9]/g, ''), 10)
        })
        const result = await estoque.createEstoque();
        console.log('Result:', result);
      }
    }
  } catch (error) {
    console.log('Erro ao criar novo estoque: ', error.message)
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

}
