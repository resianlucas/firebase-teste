import PedidoVenda, { pegarPedidoPeloID } from '../classes/PedidoVenda.js';
import { verificarLancamentoDuplicado } from '../database/pedido.js';

document.addEventListener('DOMContentLoaded', async function () {
    const ordersTable = document.getElementById('ordersTable').getElementsByTagName('tbody')[0];
    const searchInput = document.getElementById('searchInput');
    const filterButton = document.getElementById('filterButton');
    const filterPopup = document.getElementById('filterPopup');
    const closePopup = document.querySelector('.popup .close');
    const filterForm = document.getElementById('filterForm');
    const themeToggle = document.getElementById('themeToggle');

    let orders = [];

    // Obtém a data de hoje e de ontem
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const dtToday = today.toISOString().split('T')[0];
    const dtYesterday = yesterday.toISOString().split('T')[0];

    console.log('Data de hoje:', dtToday);
    console.log('Data de ontem:', dtYesterday);

    async function fetchPedidos() {
        const pedidoVenda = new PedidoVenda({
            idLoja: null,
            params: {
                dataInicial: dtYesterday, // Inclui pedidos de ontem
                dataFinal: dtToday       // Até hoje
            }
        });

        console.log(pedidoVenda);
        const result = await pedidoVenda.getPedidoVenda();

        if (result) {
            let fetchedOrders = Object.values(result).flatMap(empresa =>
                empresa.request.map(pedido => ({
                    id: pedido[0],
                    numero: pedido[1],
                    numeroLoja: pedido[2],
                    data: pedido[3],
                    idLoja: pedido[4],
                    idEmpresa: pedido[5],
                    situacao: pedido[6] // Supondo que a posição 6 seja o status do pedido
                }))
            );

            // Transformação de IDs para nomes amigáveis
            fetchedOrders.forEach(order => {
                if (order.idLoja === 203913945) {
                    order.idLoja = 'Frente Caixa';
                } else if (order.idLoja === 203744342) {
                    order.idLoja = 'Shopee';
                } else if (order.idLoja === 204036006) {
                    order.idLoja = 'Mercado Livre';
                } else if (order.idLoja === 204045472) {
                    order.idLoja = 'Shopee';
                }
            });

            fetchedOrders = await Promise.all(
                fetchedOrders.map(async order => {
                    const lancado = await verificarLancamentoDuplicado(order.id);
                    return lancado ? null : order; // Retorna null se já foi lançado
                })
            );

            // Filtrar apenas os pedidos não nulos
            orders = fetchedOrders.filter(order => order !== null);

            // Exibir os pedidos filtrados
            displayOrders(orders);
        } else {
            console.error('Erro ao buscar pedidos de venda');
        }
    }

    function displayOrders(orders) {
        ordersTable.innerHTML = '';
        orders.forEach(order => {
            let row = ordersTable.insertRow();
            row.innerHTML = `
                <td>${order.numero}</td>
                <td>${order.numeroLoja}</td>
                <td>${order.data}</td>
                <td>${order.idLoja}</td>
                <td>${order.idEmpresa}</td>
            `;
            row.addEventListener('click', () => {
                window.location.href = `pedidoDetalhes.html?id=${order.id}&empresa=${order.idEmpresa}`;
            });
        });
        console.log(orders);
    }

    // Initial fetch and display of orders
    await fetchPedidos();

    // Search functionality
    searchInput.addEventListener('keyup', function () {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredOrders = orders.filter(order =>
            order.numero.toString().includes(searchTerm) ||
            order.numeroLoja.toString().includes(searchTerm) ||
            order.data.toLowerCase().includes(searchTerm) ||
            order.idLoja.toString().includes(searchTerm) ||
            order.idEmpresa.toString().includes(searchTerm)
        );
        displayOrders(filteredOrders);
    });

    // Filter popup functionality
    filterButton.addEventListener('click', () => {
        filterPopup.style.display = 'flex';
    });

    closePopup.addEventListener('click', () => {
        filterPopup.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === filterPopup) {
            filterPopup.style.display = 'none';
        }
    });

    // Apply filters
    filterForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const dataInicial = document.getElementById('dataInicial').value;
        const dataFinal = document.getElementById('dataFinal').value;
        const idLoja = document.getElementById('idLoja').value;
        const idEmpresa = document.getElementById('idEmpresa').value;
        const status = document.getElementById('status').value === 'Todos' ? null : document.getElementById('status').value;
        console.log('Status: ', status);
        console.log('Data Inicial: ', dataInicial.toString());
        console.log('Data Final: ', dataFinal);
        console.log('ID Loja: ', idLoja);
        console.log('ID Empresa: ', idEmpresa);
        const params = {
            dataInicial: dataInicial,
            dataFinal: dataFinal,
            idLoja: idLoja
        };
        if (status !== null) {
            params.idsSituacoes = [status];
        }
        const pedidoVenda = new PedidoVenda({
            idLoja: idEmpresa,
            params: params
        });
        const result = await pedidoVenda.getPedidoVenda();
        if (result) {

            let fetchedOrders = Object.values(result).flatMap(empresa =>
                empresa.request.map(pedido => ({
                    id: pedido[0],
                    numero: pedido[1],
                    numeroLoja: pedido[2],
                    data: pedido[3],
                    idLoja: pedido[4],
                    idEmpresa: pedido[5],
                    situacao: pedido[6] // Supondo que a posição 6 seja o status do pedido
                }))
            );

            fetchedOrders.forEach(order => {
                if (order.idLoja === 203913945) {
                    order.idLoja = 'Frente Caixa'
                } else if (order.idLoja === 203744342) {
                    order.idLoja = 'Shopee'
                } else if (order.idLoja === 204036006) {
                    order.idLoja = 'Mercado Livre'
                } else if (order.idLoja === 204045472) {
                    order.idLoja = 'Shopee'
                }
            });

            fetchedOrders = await Promise.all(
                fetchedOrders.map(async order => {
                    const lancado = await verificarLancamentoDuplicado(order.id);
                    return lancado ? null : order; // Retorna null se já foi lançado
                })
            );

            // Filtrar apenas os pedidos não nulos
            orders = fetchedOrders.filter(order => order !== null);

            // Exibir os pedidos filtrados
            displayOrders(orders);

        } else {
            console.error('Erro ao buscar pedidos de venda');
        }
        filterPopup.style.display = 'none';
    });

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        document.body.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
    });
});
