



const API_URL = 'http://localhost:3000/auth';

const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');

document.getElementById('btnLogin').addEventListener('click', () => {
  loginModal.style.display = 'block';
});

document.getElementById('btnRegister').addEventListener('click', () => {
  registerModal.style.display = 'block';
});

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

function switchToRegister() {
  closeModal('loginModal');
  registerModal.style.display = 'block';
}

function switchToLogin() {
  closeModal('registerModal');
  loginModal.style.display = 'block';
}

async function register() {
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;

  try {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    alert(data.message || data.error);
    if (res.ok) {
      closeModal('registerModal');
    }
  } catch (err) {
    alert('Erro ao registrar');
  }
}

async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
  localStorage.setItem('token', data.token);

  // Verifica se é admin
  if (data.user && data.user.isAdmin) {
    alert('Bem-vindo, administrador!');
    window.location.href = 'admin.html';
  } else {
    alert('Bem-vindo, doador!');
    window.location.href = 'user.html';
  }
} else {
  alert(data.error);
}

  } catch (err) {
    alert('Erro ao logar');
  }
}
