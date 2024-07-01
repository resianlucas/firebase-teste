import { db } from '../script.js';
import { ref, set, get, child, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export async function registrarLancamento(idPedidoVenda, idLoja) {
    const lancamentoRef = ref(db, `lancamentosPedidos/${idPedidoVenda}`);
    await update(lancamentoRef, { idPedidoVenda, idLoja, status: 'lançado' });
}

export async function verificarLancamentoDuplicado(idPedidoVenda) {
    const pedidoLancadoRef = ref(db, `lancamentosPedidos/${idPedidoVenda}`);
    const pedidoLancadoSnapshot = await get(pedidoLancadoRef);
    return pedidoLancadoSnapshot.exists();
}