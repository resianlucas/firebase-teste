import { Estoque } from '../classes/Estoque.js';
import { PedidoVenda } from '../classes/PedidoVenda.js'

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
export default function lancarEstoqueByPedidoVenda(idPedidoVenda, idLoja) {

  const pedid = new PedidoVenda({
    idLoja: idLoja
  });

  //registrarPedidos(idPedidoVenda, idLoja, 'processando');

  // const produtos = pegarEstoqueAtualizado();
  // const estoques = [];


  // COLETA DO PEDIDO
  const pedido = pedid.getPedidoVendaById(idPedidoVenda);

  // VERIFICAR SE É UM PEDIDO VÁLIDO
  //verificarPedido(idPedidoVenda, idLoja);

  const empresa = Object.keys(pedido);

  var itensPedido = pedido[empresa].request.itens;
  console.log('itens pedido: ', itensPedido);

  // VERIFICAR SE PRODUTOS ESTÃO CADASTRADOS
  var verificador = verificarPedido(idPedidoVenda, idLoja);

  if (verificador) {
    itensPedido.forEach(item => {
      const estoque = {
        sku: item.codigo,
        nome: item.descricao,
        qtd: item.quantidade
      }
      estoques.push(estoque);
    });

    //VERIFICA ESTOQUE NA TABELA
    // estoques.forEach(estoque => {
    //   var produtoEncontrado = produtos.find(produto => produto.sku === estoque.sku);
    //   if (produtoEncontrado) {
    //     var novaQuantidade = produtoEncontrado.qtd - estoque.qtd;
    //     if (novaQuantidade < 0) {
    //       ruptura(produtoEncontrado);
    //       throw new Error('Estoque insuficiente para atender ao pedido\n Produto: ' + produtoEncontrado.sku);
    //     }
    //   }
    // });

    //ATUALIZA ESTOQUE NA TABELA
    estoques.forEach(estoque => {
      var produtoEncontrado = produtos.find(produto => produto.sku === estoque.sku);
      if (produtoEncontrado) {
        var novaQuantidade = produtoEncontrado.qtd - estoque.qtd;

        if (novaQuantidade < 0) {
          ruptura(produtoEncontrado);
          throw new Error('Estoque insuficiente para atender ao pedido\n Produto: ' + produtoEncontrado.sku);
        }
        atualizarEstoqueAtualizado(produtoEncontrado.sku, novaQuantidade);
      }
    });


    // LOG DE PEDIDOS PROCESSADOS
    registrarPedidos(idPedidoVenda, idLoja, 'finalizado');

    //return //Browser.msgBox('Tabela atualizada');
  } else {
    return Browser.msgBox('Não foi possível completar a execução');
  }
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

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('testButton').addEventListener('click', async () => {

    const idLoja = document.getElementById('parametro-funcao').value
    const quantidade = document.getElementById('parametro-quantidade').value
    const deposito = new Deposito({
      idLoja: idLoja
    })

    const depositos = await deposito.getDeposito();
    const idDeposito = Object.values(depositos).map(deposito => deposito.request.id);

    for (const id of idDeposito) {
      const estoque = new Estoque({
        produto: {
          id: 16239460759
        },
        depositos: {
          id: id
        },
        operacao: 'B',
        quantidade: parseFloat(quantidade),
        idLoja: idLoja
      })
      const result = await estoque.createEstoque();
      console.log('Result:', result);
    }
  });
});