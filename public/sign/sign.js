import { db } from '/public/script.js';
import { ref, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.theme-toggle').addEventListener('click', () => {
        document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    });

    const signUpForm = document.getElementById('signUpForm');

    signUpForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const user = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        }

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        console.log('Usuário: ', username, '\nSenha: ', password)

        const newUser = ref(db, 'users/' + username);
        
        set(newUser,  user)
        .then(() => {
            console.log('Cadastro realizado com sucesso!');
            alert('Cadastro realizado com sucesso!');
            document.getElementById('signUpForm').reset();
        })
        .catch((error) => {
            console.error('Erro ao cadastrar:', error);
            alert('Erro ao cadastrar: ' + error);
        });

        alert('User registered successfully!');
        
    });
});
