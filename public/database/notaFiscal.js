

function pegarNotaFiscalById() {
    const nota = new NotaFiscal({
      idLoja: 2
    })
    var notaFiscal = nota.getNFeById(20343182543);
    let nF = Object.keys(notaFiscal);
    console.log(notaFiscal[nF].request.chaveAcesso);
  }