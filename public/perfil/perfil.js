import { fetchBlings, refreshBlingToken } from '/public/script.js';

// Função para exibir os blings na tabela
function displayBlings(blings) {
    const blingTbody = document.getElementById('bling-tbody');
    blingTbody.innerHTML = ''; // Limpa a tabela

    Object.entries(blings).forEach(([clientId, bling]) => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = bling.name;
        row.appendChild(nameCell);

        const accessTokenCell = document.createElement('td');
        accessTokenCell.textContent = bling.access_token;
        row.appendChild(accessTokenCell);

        const refreshTokenCell = document.createElement('td');
        refreshTokenCell.textContent = bling.refresh_token;
        row.appendChild(refreshTokenCell);

        const actionCell = document.createElement('td');
        const refreshButton = document.createElement('button');
        refreshButton.textContent = 'Atualizar';

        refreshButton.onclick = async () => {
            try {
                console.log(
                    'Client ID: ', bling.client_id,
                    '\nClient Secret: ', bling.client_secret,
                    '\nRefresh Token: ', bling.refresh_token
                );
                
                const refresh = await refreshBlingToken(bling.client_id, bling.client_secret, bling.refresh_token, bling.id);
                console.log(refresh);
                if (refresh) {
                    // Aqui já aparece o alerta de sucesso dentro da função refreshBlingToken
                }
                const updatedBlings = await fetchBlings();
                displayBlings(updatedBlings);
            } catch (error) {
                // O alerta de erro já será mostrado na função refreshBlingToken
                console.error('Erro ao atualizar token:', error);
            }
        
        };
        actionCell.appendChild(refreshButton);
        row.appendChild(actionCell);

        blingTbody.appendChild(row);
    });
}

// Inicializa a página, buscando e exibindo os blings
async function init() {
    try {
        const blings = await fetchBlings();
        if (blings) {
            displayBlings(blings);
        }
    } catch (error) {
        console.error('Erro ao buscar blings: ', error);
    }
}

// Chama a função init ao carregar a página
window.addEventListener('load', init);
