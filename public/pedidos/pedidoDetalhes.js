import PedidoVenda, { pegarPedidoPeloID } from '../classes/PedidoVenda.js';
import { lancarEstoqueByPedidoVenda as lancarEstoque } from '../classes/Estoque.js';
import { verificarLancamentoDuplicado } from '../database/pedido.js';

document.addEventListener('DOMContentLoaded', async function () {
    const pedidoIdSpan = document.getElementById('pedidoId');
    const numeroPedidoSpan = document.getElementById('numeroPedido');
    const numeroLojaSpan = document.getElementById('numeroLoja');
    const dataPedidoSpan = document.getElementById('dataPedido');
    const totalPedidoSpan = document.getElementById('totalPedido');
    const situacaoPedidoSpan = document.getElementById('situacaoPedido');
    const idLojaSpan = document.getElementById('idLoja');
    const idEmpresaSpan = document.getElementById('idEmpresa');
    const itemsTable = document.getElementById('itemsTable').getElementsByTagName('tbody')[0];
    const lancarEstoqueButton = document.getElementById('lancarEstoqueButton');

    // Função para buscar parâmetros da URL
    function getQueryParams() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const queryArray = queryString.split('&');
        queryArray.forEach(item => {
            const [key, value] = item.split('=');
            params[key] = decodeURIComponent(value);
        });
        return params;
    }

    // Função para exibir detalhes do pedido
    async function displayPedidoDetalhes(id, idEmpresa) {
        try {
            const pedido = await pegarPedidoPeloID(id, idEmpresa);
            const empresa = Object.keys(pedido)
            console.log(empresa)

            if (pedido) {
                pedidoIdSpan.textContent = pedido[empresa].request.id;
                numeroPedidoSpan.textContent = pedido[empresa].request.numero;
                numeroLojaSpan.textContent = pedido[empresa].request.numeroLoja;
                dataPedidoSpan.textContent = pedido[empresa].request.data;
                totalPedidoSpan.textContent = pedido[empresa].request.total;
                situacaoPedidoSpan.textContent = pedido[empresa].request.situacao.id;
                idLojaSpan.textContent = pedido[empresa].request.idLoja;
                idEmpresaSpan.textContent = pedido[empresa].id;

                // Exibir itens do pedido
                pedido[empresa].request.itens.forEach(item => {
                    let row = itemsTable.insertRow();
                    row.innerHTML = `
                        <td>${item.codigo}</td>
                        <td>${item.descricao}</td>
                        <td>${item.quantidade}</td>
                        <td>${item.valor}</td>
                    `;
                });
            } else {
                console.error('Erro ao buscar detalhes do pedido');
            }
        } catch (error) {
            console.error('Erro ao buscar detalhes do pedido:', error);
        }
    }

    async function handleLancarEstoque() {
        const params = getQueryParams();
        const pedidoId = parseInt(params.id);
        const idLoja = parseInt(params.empresa);

        if (!pedidoId || !idLoja) {
            console.error('Parâmetros inválidos para lançamento de estoque.');
            return;
        }

        try {
            await lancarEstoque(pedidoId, idLoja);
            console.log("Estoque lançado com sucesso!");
            alert("Estoque lançado com sucesso!");
        } catch (error) {
            console.error("Erro ao lançar estoque:", error.message || error);
            alert(`Erro ao lançar estoque: ${error.message || error}`);
        }
    }

    // Obtém o ID do pedido da URL
    const params = getQueryParams();
    const pedidoId = params.id;
    const empresaId = params.empresa;
    console.log(pedidoId)
    if (pedidoId) {
        await displayPedidoDetalhes(parseInt(pedidoId), empresaId);
    }

    lancarEstoqueButton.addEventListener('click', handleLancarEstoque);

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        document.body.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
    });
});

// document.addEventListener('DOMContentLoaded', ()=>{
//     document.getElementById('testButto').addEventListener('click', async () => {

//         const id = parseInt(document.getElementById('parametro-funca').value)
//         console.log(typeof id)
//         const empresa = document.getElementById('parametro-quantidad').value

//         const resultado = await pegarPedidoPeloID(id, empresa)
//         console.log('resultado: ', resultado);

//     })
// })