import Deposito from './Deposito.js';
import { BaseClass } from './BaseClass.js';
import PedidoVenda from './PedidoVenda.js';
import Produto, { pegarIdBySku, getAllProduct } from './Produto.js';
import { updateEstoque, createEstoque, verificarEstoque } from '../database/estoque.js';
import { registrarLancamento, verificarLancamentoDuplicado } from '../database/pedido.js';

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

export async function lancarEstoqueByPedidoVenda(idPedidoVenda, idLoja) {
  const pedid = new PedidoVenda({ idLoja: idLoja });

  // Verifica se o pedido já foi lançado
  const pedidoLancado = await verificarLancamentoDuplicado(idPedidoVenda);
  if (pedidoLancado) {
    console.error(`Pedido de venda com ID ${idPedidoVenda} já foi lançado.`);
    return;
  }

  // Coleta do pedido
  const pedido = await pedid.getPedidoVendaById(idPedidoVenda);
  console.log('Pedido Unitário: ', pedido);

  // Verifica se o pedido possui nota fiscal

  const empresa = Object.keys(pedido)[0]; // Assumindo que o objeto empresa está na primeira chave
  let itensPedido = pedido[empresa].request.itens;
  console.log('Itens do pedido: ', itensPedido);

  if (pedido[empresa].request.notaFiscal.id === 0) {
    console.error(`Pedido de venda com ID ${idPedidoVenda} não possui nota fiscal.`);
    return;
  }
  let operacaoInvalida = false;
  let itensNaoCadastrados = [];

  for (const item of itensPedido) {
    const id = item.produto.id;
    const produto = new Produto({ idLoja: idLoja });
    const prod = await produto.getProdutoById(id);
    if (!prod) {
      console.error(`Produto com ID ${id} não encontrado.`);
      itensNaoCadastrados.push(id);
      continue;
    }

    let sku;
    const produtoMestre = await produto.getProdutoById(id);
    if (produtoMestre && produtoMestre[empresa].request.codigo) {
      sku = produtoMestre[empresa].request.codigo;
    } else if (prod[empresa].request.estrutura && prod[empresa].request.estrutura.componentes.length > 0) {
      sku = prod[empresa].request.estrutura.componentes[0].produto.codigo;
    } else {
      console.error(`Produto mestre ou estrutura para o produto com ID ${id} não encontrado.`);
      itensNaoCadastrados.push(id);
      continue;
    }

    const quantidadeSolicitada = item.quantidade;

    const estoqueValido = await verificarEstoque(sku, quantidadeSolicitada);
    if (!estoqueValido) {
      console.error(`Operação inválida: quantidade negativa não permitida para SKU: ${sku}.`);
      operacaoInvalida = true;
      break; // Interrompe o loop se encontrar uma quantidade negativa
    }
  }

  if (!operacaoInvalida) {
    try {
      for (const item of itensPedido) {
        const id = item.produto.id;
        const produto = new Produto({ idLoja: idLoja });
        let prod = await produto.getProdutoById(id);
        let sku;

        const produtoMestre = await produto.getProdutoById(id);
        if (produtoMestre && produtoMestre[empresa].request.codigo) {
          sku = produtoMestre[empresa].request.codigo;
        } else if (prod[empresa].request.estrutura && prod[empresa].request.estrutura.componentes.length > 0) {
          sku = prod[empresa].request.estrutura.componentes[0].produto.codigo;
        } else {
          console.error(`Produto mestre ou estrutura para o produto com ID ${id} não encontrado.`);
          itensNaoCadastrados.push(id);
          continue;
        }

        const quantidadeSolicitada = item.quantidade;
        console.log(`Atualizando quantidade para SKU: ${sku} com quantidade: ${quantidadeSolicitada}`);
        await atualizarEstoque(sku, -quantidadeSolicitada);
      }
      // Registrar que o pedido foi lançado
      await registrarLancamento(idPedidoVenda, idLoja);
      console.log('Estoque atualizado com sucesso!');

      if (itensNaoCadastrados.length > 0) {
        console.warn('Itens não cadastrados encontrados:', itensNaoCadastrados);
        // Lógica adicional para lidar com itens não cadastrados, se necessário
      }
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
    }
  } else {
    console.error('A operação foi cancelada devido a uma validação inválida.');
  }
}

// document.addEventListener('DOMContentLoaded', () => {
//   document.getElementById('testButto').addEventListener('click', async () => {

//     const id = parseInt(document.getElementById('parametro-funca').value)
//     const empresa = document.getElementById('parametro-quantidad').value
//     try {
//       lancarEstoqueByPedidoVenda(id, empresa);
//     } catch (e) {
//       console.log('Erro causado ao lancar estoque: ', e)
//     }
//   })
// })