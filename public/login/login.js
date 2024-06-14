import { db , app } from '/public/script.js';
import {auth } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js'

// Referência para o serviço de autenticação
const auth = firebase.auth();

// Evento de clique no botão "Toggle Theme"
document.querySelector('.theme-toggle').addEventListener('click', () => {
    document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
});

// Função para realizar o login
function login() {
    const email = document.getElementById('usuario').value;
    const password = document.getElementById('senha').value;

    // Sign in com e-mail e senha
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Login bem sucedido
            const user = userCredential.user;
            console.log('Usuário logado:', user);

            // Redirecionar para página de produtos ou outra página protegida
            window.location.href = '/produtos/produtos.html'; // Redireciona para a página de produtos após login
        })
        .catch((error) => {
            // Tratamento de erros
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Erro de login:', errorMessage);
            alert('Erro de login. Verifique suas credenciais e tente novamente.');
        });
}
