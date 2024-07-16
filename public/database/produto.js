import { db } from '../script.js';
import { ref, set, get, child, update, remove} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export async function getProduct(sku) {
  const produtoRef = ref(db, 'products/' + sku);
  const snapshot = await get(produtoRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    console.log('Produto não encontrado');
    return null;
  }
}

export async function deleteProduct(sku) {
  const produtoRef = ref(db, 'products/' + sku);
  const snapshot = await get(produtoRef);

  if (snapshot.exists()) {
      const produto = snapshot.val();
      const produtoDeletadoRef = ref(db, 'produtosDeletados/' + sku);
      
      // Primeiro, salva o backup na tabela 'produtosDeletados'
      await set(produtoDeletadoRef, produto);

      // Depois, remove o produto da tabela principal 'products'
      await remove(produtoRef);

      console.log(`Produto com SKU ${sku} foi deletado e um backup foi salvo.`);
  } else {
      console.log('Produto não encontrado para deletar.');
  }
}


export async function createProduct(produto) {
  const produtoRef = ref(db, 'products/' + produto.sku);
  await set(produtoRef, produto);
}

export async function updateProduct(sku, updates) {
  const produtoRef = ref(db, 'products/' + sku);
  await update(produtoRef, updates);
}

export async function getAllProducts() {
  const produtos = [];
  const produtoRef = ref(db, 'products');
  const snapshot = await get(produtoRef);
  snapshot.forEach((childSnapshot) => {
    produtos.push(childSnapshot.val());
  });
  return produtos;
}

export async function getProductIdsBySkus(sku) {
  const produtoRef = ref(db, '/ids/' + sku);
  const snapshot = await get(produtoRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    console.log('Nenhum produto encontrado com o SKU fornecido.');
    return [];
  }
}

export async function getProductIdsBySku(sku) {
  const produtoRef = ref(db, '/ids/' + sku);
  const snapshot = await get(produtoRef);
  if (snapshot.exists()) {

    
    return Object.keys(snapshot.val());
  } else {
    console.log('Nenhum produto encontrado com o SKU fornecido.');
    return [];
  }
}

export async function setProductId(sku, id, data) {
  const produtoRef = ref(db, `/ids/${sku}/${id}`);
  await set(produtoRef, data)
}
