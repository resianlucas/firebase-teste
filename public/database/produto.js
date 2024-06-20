function pegarProdutosById(id = 16229918534, idLoja = 1) {
    const produt = new Produto({idLoja: idLoja})
    const produtoFinal = produt.getProdutoById(id);
    const obj = Object.keys(produtoFinal);
  
    console.log(produtoFinal.styllo.request.midia);
  
    // const produto =  new Produto({
    //   id: produtoFinal[obj].request.id,
    //   nome: produtoFinal[obj].request.nome,
    //   codigo: produtoFinal[obj].request.codigo,
    //   preco: produtoFinal[obj].request.preco,
    //   gtin: produtoFinal[obj].request.gtin,
    //   marca: produtoFinal[obj].request.marca,
    //   descricaoCurta: produtoFinal[obj].request.descricaoCurta,
    //   midia: {imagens: {externas: produtoFinal[obj].request.midia.imagens.externas}}
    // })
    // catchProduct(produto)
  }
  
  function pegarTodosIds() {
    const lastRow = sheetIdByProduto.getLastRow();
    const produtoData = sheetIdByProduto.getRange(2, 1, lastRow - 1, 4).getValues();
    const ids =  produtoData.map(produto => ({
      sku: produto[0],
      id: produto[1],
      idLoja: produto[2]
    }));
    return ids;
  }
  
  function pegarTodosProdutos() {
    const lastRow = sheetProduto.getLastRow();
    const produtosData = sheetProduto.getRange(2, 1, lastRow - 1, 10).getValues();
    const produtos = produtosData.map(prod => ({
      sku: prod[0],
      ean: prod[1],
      nome: prod[2],
      marca: prod[3],
      preco: prod[4],
      descricao: prod[6],
      imagem: prod[7],
      qtd: prod[8]
    }));
    console.log(typeof produtos)
    return produtos
  }
  
  function pegarProdutoByTabela() {
    const sheetTelaProduto = spreadsheet.getSheetByName('TelaProduto');
    const lastRow = sheetTelaProduto.getLastRow();
    const produtosExistentes = pegarTodosProdutos();  
    const produtos = sheetTelaProduto.getRange(2, 1, lastRow -1, 8).getValues();
  
    console.log(produtos)
  
    var prod = produtos.map(p =>({
      codigo: p[0],
      gtin: p[1],
      nome: p[2],
      marca: p[3],
      preco: p[4],
      descricaoCurta: p[5],
      imagem: p[7].split(',')
    }))
  
    console.log('console prod', prod)
  
    let produtosRepetidos = [];
    prod.forEach(produtoFinal =>{
      try {
        const produtoExistente = produtosExistentes.find(produto => produto.sku === produtoFinal.codigo || produto.ean === produtoFinal.gtin);
        if (!produtoExistente) {
          const produto = new Produto({
            id: produtoFinal.id,
            nome: produtoFinal.nome,
            codigo: produtoFinal.codigo,
            preco: produtoFinal.preco,
            gtin: produtoFinal.gtin,
            marca: produtoFinal.marca,
            descricaoCurta: produtoFinal.descricaoCurta,
            midia: { imagens: { externas: produtoFinal.imagem } }
          });
          catchProduct(produto);
        } else {
          produtosRepetidos.push(produtoExistente);
        };
      } catch (erro) {
        console.error('Erro no produto: ', erro.stack);
        throw new Error(erro);
      };
    });
    if (produtosRepetidos.length > 0) {
      throw new Error('Produtos já cadastrados: ' + produtosRepetidos.map(produto => produto.sku) +
      "\n\nQuantidade de produtos já cadastrados: " + produtosRepetidos.length);
    };
  }
  
  function separarProduto(itensPedido, id) {
    const lastRow  = sheetListaProdutos.getLastRow();
  
    itensPedido.forEach(item => {
      if (item.produto.id === id) {
        sheetListaProdutos.getRange(lastRow + 1, 1).setValue(item.produto.id);
        sheetListaProdutos.getRange(lastRow + 1, 2).setValue(item.codigo);
        sheetListaProdutos.getRange(lastRow + 1, 3).setValue(item.descricao);
      }
    })
    Browser.msgBox('Produto foi incluido na lista para anunciar')
  }
  
  
  function catchProduct(produto) {
    const lastRow  = sheetProduto.getLastRow();
  
    sheetProduto.getRange(lastRow + 1, 1).setValue(produto.codigo); //sku produto
    sheetProduto.getRange(lastRow + 1, 2).setValue(produto.gtin); //ean produto
    sheetProduto.getRange(lastRow + 1, 3).setValue(produto.nome); //nome produto  
    sheetProduto.getRange(lastRow + 1, 4).setValue(produto.marca); //marca produto
    sheetProduto.getRange(lastRow + 1, 5).setValue(produto.preco); //preco produto
    sheetProduto.getRange(lastRow + 1, 6).setValue(produto.descricaoCurta); // descricao produto
    sheetProduto.getRange(lastRow + 1, 7).setValue(produto.categoria); // categoria produto
    sheetProduto.getRange(lastRow + 1, 8).setValue(produto.midia.imagens.externas.join(',')); // imagens produto
    sheetProduto.getRange(lastRow + 1, 9).setValue(0); //estoque zerado
  
    console.log('catchProduct: ', produto)
  
    //if(produto.id !== 0 && produto.id !== null)
    if(produto)
    {
      console.log('chamada da funcao pegar ID Produto: ', produto.codigo)
      todosIds(produto);
    }
  }
  
  function pegarIdsProdutoBySku(sku) {
    let nextRow = sheetIdByProduto.getLastRow() + 1;
    const produto = new Produto ({params: {criterio: 5, codigo: sku}})
    let produtos = produto.getProduto();
    console.log('produto encontrado: ',produtos)
    for (const chave in produtos) {
      if (produtos.hasOwnProperty(chave)) {
        const bling = produtos[chave];
        if(!bling.request.length < 1) {
          sheetIdByProduto.getRange(nextRow, 1).setValue(bling.request[0].codigo);
          sheetIdByProduto.getRange(nextRow, 2).setValue(bling.request[0].id);
          sheetIdByProduto.getRange(nextRow, 3).setValue(bling.id);
          sheetIdByProduto.getRange(nextRow, 4).setValue(chave);
          nextRow++;
        }
      }
    }
  }
  
  function pegarSkuById(id) {
    const ids = pegarTodosIds();
    const sku = ids.find(produto => produto.id === id);
    return sku;
  }
  
  function pegarIdBySku(sku, idLoja) {
    const ids = pegarTodosIds();
    if(idLoja) {
      const id = ids.find(produto => produto.sku === sku && produto.idLoja === idLoja);
      console.log(id);
      return id;
    } else {
      const id = ids.filter(produto => produto.sku === sku);
      console.log(id);
      return id;
    }
  }
  
  function todosIds(produto) {
    try{
      let prod = pegarIdBySku(produto.codigo);
      if(prod.length < 1){
        console.log('sem codigo: ', produto.codigo)
        pegarIdsProdutoBySku(produto.codigo);
      };
    } catch (e) {
      console.log(e);
    };
  }
  
  ////////////////////////////////////////////////////
  //METODOS DE VERIFICAÇÃO//
  ////////////////////////////////////////////////////
  // function verificarProduto(itensPedido, idLoja) {
  //   const lastRow  = sheetProduto.getLastRow();
  //   const produtosData = sheetProduto.getRange(2, 1, lastRow - 1, 10).getValues();
  
  //   for (var i = 0; i < produtosData.length; i++) {
  //     var produto = produtosData[i];
  //     // Verificar se os dados nas colunas obrigatórias (1, 2, 3, 4, 5, 6) estão preenchidos
  //     for (var j = 0; j < produto.length; j++) {
  //       if ((j === 0 || j === 1 || j === 2 || j === 3 || j === 4 || j === 5 ) && (produto[j] === '' || produto[j] === null || produto[j] === undefined)) {
  //         throw new Error('Dados incompletos na linha ' + (i + 2) + ', coluna ' + (j + 1));
  //       }
  //     }
  //   }
  //   var produtos = pegarTodosProdutos();
  
  //   var item = [];
  
  //   itensPedido.forEach(itens => {
  //     var id = itens.produto.id;
  //     var codigo = itens.codigo;
  //     var qtd = itens.quantidade;
  //     var prod = {
  //       id: id,
  //       sku: codigo,
  //       qtd: qtd
  //     }
  //     item.push(prod);
  //   });
  //   var produtoNaoEncontrado = [];
  
  //   //VERIFICA SE OS PRODUTOS CONTEM ESTOQUE OU SE ESTÃO ZERADOS
  //   //VERIFICA SE O PRODUTO ESTÁ REGISTRADO NA TABELA
  //   for (var i = 0; i < item.length; i++) {
  //     var sku = item[i].sku;
  //     var produtoEncontrado = produtos.find(produto => produto.sku === sku);
  
  //     if (produtoEncontrado) {
  //       if(!produtoEncontrado.qtd || produtoEncontrado.qtd === 0 || produtoEncontrado.qtd < 0) {
  //         console.log('ruptura(produtoEncontrado)')
  //         throw new Error('Quantidade de produto inválida ou estoque zerado' + produtoEncontrado.sku)
  //       }
  //     } else {
  //       produtoNaoEncontrado.push({sku: sku});
  //     }
  //   }
  
  //   //VERIFICA QUANTIDADES DOS PRODUTOS ANTES DE LANCAR O ESTOQUE
  //   for (var j = 0; j < item.length; j++) {
  //     var id = item[j].id
  //     var sku = item[j].sku;
  //     var quantidade = item[j].qtd;
  //     var produtoEncontrado = produtos.find(produto => produto.sku === sku);
  
  //     if (produtoEncontrado) {
  //       var novaQuantidade = produtoEncontrado.qtd - quantidade;
  //       if (novaQuantidade < 0) {
  //         ruptura(produtoEncontrado)
  //         throw new Error('Estoque insufiente para atender ao pedido\n Produto: ' + produtoEncontrado.sku)
  //       }
  //     } else {
  //       var resposta = Browser.inputBox('O produto ' + sku + ' não foi encontrado.\\n\\nO que você deseja fazer?\\nA - IMPORTAR\\nB - SEPARAR\\nC - CANCELAR');
  //       if (resposta.toUpperCase() == 'A') {
  //         pegarProdutosById(id, idLoja);
  //       } else if (resposta.toUpperCase() == 'B') {
  //         separarProduto(itensPedido, id);
  //       } else {
  //         throw new Error('Operação cancelada pelo usuário');
  //       }
  //     }
  //   }
  
  //   if (produtoNaoEncontrado.length <= 0) {
  //     return true
  //   } else {
  //     var msg = 'Alguns produtos não foram encontrados:'
  //     produtoNaoEncontrado.forEach(produto => {
  //       msg += '\nID do produto: ' + produto.sku;
  //     })
  //     throw new Error(msg)
  //   }
  // }
  
  function criarProduto() {
    const produto = new Produto({
      payload: {
        nome: 'Gel Fixador Deslumbre Lowell 180ml',
        codigo: 'Gel Deslumbre 180ml Lowell',
        gtin: '7898556752879',
        marca: 'Lowell',
        descricaoCurta: 'Fixação forte e flexível com efeito brilho molhado.',
        preco: 36.6,
        midia: {
          imagens: {externas: {link: 'https://i.ibb.co/VNn4Xyp/7898556752879.png'}}
        },
      }
    })
    console.log(produto.payload)
    const produtoCriado = produto.createProduct();
    console.log(produtoCriado);
    console.log(todosIds(produto.payload));
  }
  
  function verificarProduto(sku) {
    const lastRow  = sheetProduto.getLastRow();
    const produtosData = sheetProduto.getRange(2, 1, lastRow - 1, 10).getValues();
  
    for (let i = 0; i < produtosData.length; i++) {
      let produto = produtosData[i];
      for (let j = 0; j < produto.length; j++) {
        if ((j === 0 || j === 1 || j === 2 || j === 3 || j === 4 || j === 5 ) && (produto[j] === '' || produto[j] === null || produto[j] === undefined)) {
          throw new Error('Dados incompletos na linha ' + (i + 2) + ', coluna ' + (j + 1));
        }
      }
    }
  
    let produtos = pegarTodosProdutos();
    let produtoNaoEncontrado = [];
    let produtoEncontrado = produtos.find(produto => produto.sku === sku);
  
    if (produtoEncontrado) {
      if(!produtoEncontrado.qtd || produtoEncontrado.qtd === 0 || produtoEncontrado.qtd < 0) {
        console.log('ruptura(produtoEncontrado)')
        throw new Error('Quantidade de produto inválida ou estoque zerado' + produtoEncontrado.sku)
      }
    } else {
      produtoNaoEncontrado.push({sku: sku});
    }
  
    // if (!produtoEncontrado) {
    //   var resposta = Browser.inputBox('O produto ' + sku + ' não foi encontrado.\\n\\nO que você deseja fazer?\\nA - IMPORTAR\\nB - SEPARAR\\nC - CANCELAR');
    //   if (resposta.toUpperCase() == 'A') {
    //     pegarProdutosById(id, idLoja);
    //   } else if (resposta.toUpperCase() == 'B') {
    //     separarProduto(itensPedido, id);
    //   } else {
    //     throw new Error('Operação cancelada pelo usuário');
    //   }
    // }
    
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