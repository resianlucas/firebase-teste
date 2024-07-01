import PedidoVenda, { pegarPedidoPeloID } from '../classes/PedidoVenda.js';

document.addEventListener('DOMContentLoaded', async function () {
    const ordersTable = document.getElementById('ordersTable').getElementsByTagName('tbody')[0];
    const searchInput = document.getElementById('searchInput');
    const filterButton = document.getElementById('filterButton');
    const filterPopup = document.getElementById('filterPopup');
    const closePopup = document.querySelector('.popup .close');
    const filterForm = document.getElementById('filterForm');
    const themeToggle = document.getElementById('themeToggle');

    let orders = [];
    const date = new Date('2024-07-01');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() retorna 0-11
    const year = date.getFullYear();
    const dataInicial = `${day}-${month}-${year}`;

    async function fetchPedidos() {
        const pedidoVenda = new PedidoVenda({
            idLoja: null,
            // params: {
            //     dataInicial: dataInicial
            // }
        });
        const result = await pedidoVenda.getPedidoVenda();

        if (result) {
            orders = Object.values(result).flatMap(empresa => empresa.request.map(pedido => ({
                id: pedido[0],
                numero: pedido[1],
                numeroLoja: pedido[2],
                data: pedido[3],
                idLoja: pedido[4],
                idEmpresa: pedido[5],
                situacao: pedido[6] // Supondo que a posição 6 seja o status do pedido
            })));
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
                <td>${order.id}</td>
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
        console.log(orders)
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
    filterForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const status = document.getElementById('status').value;
        const dataInicial = document.getElementById('dataInicial').value;
        const dataFinal = document.getElementById('dataFinal').value;
        const idLoja = document.getElementById('idLoja').value;
        const idEmpresa = document.getElementById('idEmpresa').value;

        console.log(status);

        const filteredOrders = orders.filter(order => {
            const statusMatch = !status || order.situacao == status;
            const dataMatch = (!dataInicial || new Date(order.data) >= new Date(dataInicial)) &&
                              (!dataFinal || new Date(order.data) <= new Date(dataFinal));
            const idLojaMatch = !idLoja || order.idLoja == idLoja;
            const idEmpresaMatch = !idEmpresa || order.idEmpresa == idEmpresa;
            return statusMatch && dataMatch && idLojaMatch && idEmpresaMatch;
        });

        displayOrders(filteredOrders);
        filterPopup.style.display = 'none';
    });

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        document.body.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
    });
});
