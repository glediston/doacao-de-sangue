


const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

// Elementos de email
const emailAtual = document.getElementById('emailAtual');
const btnEditarEmail = document.getElementById('btnEditarEmail');
const formEmail = document.getElementById('formEmail');
const novoEmail = document.getElementById('novoEmail');
const btnSalvarEmail = document.getElementById('btnSalvarEmail');

// Elementos de senha
const btnEditarSenha = document.getElementById('btnEditarSenha');
const formSenha = document.getElementById('formSenha');
const senhaAtual = document.getElementById('senhaAtual');
const senhaNova = document.getElementById('senhaNova');
const btnSalvarSenha = document.getElementById('btnSalvarSenha');

// Carrega o email atual do usuário
async function carregarEmail() {
  try {
    const res = await fetch(`http://localhost:3000/api/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const usuarios = await res.json();
    const usuario = usuarios.find(u => u.id === Number(userId));

    if (usuario) {
      emailAtual.textContent = usuario.email;
    } else {
      emailAtual.textContent = 'Não encontrado';
    }
  } catch (err) {
    emailAtual.textContent = 'Erro ao carregar';
  }
}

carregarEmail();

// Mostrar formulário de edição de email
btnEditarEmail.addEventListener('click', () => {
  formEmail.style.display = 'block';
  novoEmail.value = emailAtual.textContent;
});

// Salvar novo email
btnSalvarEmail.addEventListener('click', async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email: novoEmail.value })
    });

    const data = await res.json();
    alert(data.message || 'Email atualizado!');
    emailAtual.textContent = novoEmail.value;
    formEmail.style.display = 'none';
  } catch (err) {
    alert('Erro ao atualizar email');
  }
});

// Mostrar formulário de edição de senha
btnEditarSenha.addEventListener('click', () => {
  formSenha.style.display = 'block';
});

// Salvar nova senha
btnSalvarSenha.addEventListener('click', async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/user/${userId}/senha`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        senhaAtual: senhaAtual.value,
        senhaNova: senhaNova.value
      })
    });

    const data = await res.json();
    alert(data.message || 'Senha atualizada!');
    formSenha.style.display = 'none';
    senhaAtual.value = '';
    senhaNova.value = '';
  } catch (err) {
    alert('Erro ao atualizar senha');
  }
});
