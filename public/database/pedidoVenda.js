import PedidoVenda from '../classes/PedidoVenda.js';
import { db } from '../script.js';
import { lancarEstoqueByPedidoVenda as lancarEstoque } from './estoque.js';

function pegarPedidos() {

  // var dataInit = sheetPedido.getRange('J2').getValue();//parametros
  // var dataInitial = new Date(dataInit);//parametros
  // var dataHoje = Utilities.formatDate(data, Session.getScriptTimeZone(), 'yyyy-MM-dd');//parametros
  // var dataInicial = Utilities.formatDate(dataInitial, Session.getScriptTimeZone(), 'yyyy-MM-dd');//parametros
  // const idLoja = sheetPedido.getRange('H2').getValue();//parametros
  // let status = sheetPedido.getRange('I2').getValue();//parametros

  // if (status === 'Aberto') {
  //   status = 6;
  // } else if (status === 'Atendido') {
  //   status = 9;
  // } else if (status === 'Cancelado') {
  //   status = 12;
  // } else if (status === 'Andamento') {
  //   status = 15;
  // }

  const pedido = new PedidoVenda({
    idLoja: idLoja,
    params: {
      dataInicial: dataInicial,
      dataFinal: dataHoje,
    }
  })

  const pedidos = pedido.getPedidoVenda();
  if (!pedidos || pedidos === '' || pedidos === 'undefined' || pedidos === null || pedidos.length <= 0) {
    throw new Error('Nenhum pedido encontrado')
  }

  sheetPedido.getRange(2, 1, 200, 6).clearContent();

  for (const chave in pedidos) {
    if (pedidos.hasOwnProperty(chave)) {
      const pedido = pedidos[chave];
      if (!pedido.request.length < 1) {
        console.log('pedido: ', pedido.request);
        console.log(pedido.request[0].length);
        sheetPedido.getRange(2, 1, pedido.request.length, pedido.request[0].length).setValues(pedido.request);
      }
    }
  }

  if (status === 9) {
    var resposta = Browser.msgBox('Deseja lançar estoque?', Browser.Buttons.YES_NO)
    console.log(resposta.toUpperCase())
    if (resposta.toUpperCase() === 'YES') {
      pegarPedidosMassa()
    } else if (resposta.toUpperCase() === 'NO') {
      Browser.msgBox('Estoque não foi lançado')
    }
  }

}

async function pegarPedidosMassa(pedido) {

  const pedidos = await pedido.getPedidoVenda();

  for (const chave in pedidos) {
    if (pedidos.hasOwnProperty(chave)) {
      const pedidoUnit = pedidos[chave];
      if (!pedidoUnit.request.length < 1) {
        const pedidosData = pedidoUnit.request;
        pedidosData.forEach(async ped => {
          console.log(
            'Detalhes dos pedidos: ',
            '\nID: ', ped[0],
            '\nID multiloja: ', ped[4],
            '\nID Loja: ', ped[5]
          )

          try {
            await lancarEstoque(ped[0], ped[5]);
          } catch (error) {
            console.error('Erro ao processar pedido:', ped, error);
            //registrarErros(ped, error.stack)
          }

        });
      }
    }
  }

}


////////////////////////////////////////////////////
//METODOS DE VERIFICAÇÃO//
////////////////////////////////////////////////////
function verificarPedido(idPedidoVenda = 20341264936, idLoja = 1) {
  const pedidoVenda = new PedidoVenda({
    idLoja: idLoja
  });
  const pedido = pedidoVenda.getPedidoVendaById(idPedidoVenda);
  const empresa = Object.keys(pedido);
  const itens = pedido[empresa].request.itens;
  const notaFiscal = pedido[empresa].request.notaFiscal;

  if (!notaFiscal.id || notaFiscal.id === 0) {
    throw new Error('Pedido sem nota fiscal' + pedido[empresa].request.id);
  }

  //verifica se o pedido contém itens
  if (!itens) {
    throw new Error('Esse pedido não possui itens' + pedido[empresa].request.id);
  }

  // // //arrumar no construtor de parametros para o pedido de venda (status cancelado)
  // // //verificar se é um pedido valido
  // // if (pedido[empresa].request.situacao.valor !== 1) {
  // //   throw new Error('Esse pedido não é valido');
  // // }

  itens.forEach(prod => {
    if (prod.produto.id === 0) {
      separarProduto(itens, prod.produto.id);
      throw new Error('O produto não tem id, id igual a zero: ' + prod.codigo);
    }
  })

  itens.forEach(item => {
    verificarProduto(item.codigo);
  });
  return true
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('testButton').addEventListener('click', async () => {

    const idLoja = document.getElementById('parametro-funcao').value
    const limite = document.getElementById('parametro-quantidade').value

    const pedido = new PedidoVenda({
      idLoja: idLoja,
      params: {
        limite: limite,
        idLoja: 204045472
      }
    })

    pegarPedidosMassa(pedido);

    // const pedidos = await pedido.getPedidoVenda();

    // console.log('Pedidos: ', pedidos)

    // for (const chave in pedidos) {
    //   if (pedidos.hasOwnProperty(chave)) {
    //     const pedido = pedidos[chave];
    //     if (!pedido.request.length < 1) {
    //       console.log('requisição completa: ', pedido)
    //       console.log('pedido: ', pedido.request);
    //     }
    //   }
    // }

    //console.log('Result:', result);

  });
});