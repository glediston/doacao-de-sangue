const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

const btnBuscar = document.getElementById('btnBuscar');
const btnMinhaConta = document.getElementById('btnMinhaConta');
const submenuConta = document.getElementById('submenuConta');
const btnDadosPessoais = document.getElementById('btnDadosPessoais');
const userList = document.getElementById('userList');
let usuarioLogado = null; // ✅ variável global

// 🔄 Alterna visibilidade do submenu "Minha Conta"
btnMinhaConta.addEventListener('click', () => {
  submenuConta.style.display = submenuConta.style.display === 'none' ? 'block' : 'none';
});

// 🔍 Buscar lista de doadores
btnBuscar.addEventListener('click', async () => {
  userList.innerHTML = `
    <h2>Buscar Doadores</h2>
    <label for="filtroDisponibilidade">Filtrar por:</label>
    <select id="filtroDisponibilidade">
      <option value="disponiveis">Somente disponíveis</option>
      <option value="todos">Todos os usuários</option>
    </select>
    <div id="listaUsuarios" style="margin-top: 20px;"></div>
  `;

  const filtro = document.getElementById('filtroDisponibilidade');
  const listaUsuarios = document.getElementById('listaUsuarios');

  async function buscarUsuarios() {
    try {
      const rota = filtro.value === 'todos'
        ? 'http://localhost:3000/api/users'
        : 'http://localhost:3000/doacao/usuarios-disponiveis';

      const res = await axios.get(rota, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const users = res.data;
      listaUsuarios.innerHTML = '';

      users.forEach(user => {
        const card = document.createElement('div');
        card.classList.add('user-card');
        card.innerHTML = `
          <div class="user-info">
            <strong>${user.name}</strong> — ${user.email}
          </div>
        `;
        listaUsuarios.appendChild(card);
      });
    } catch (err) {
      alert('Erro ao buscar usuários');
      console.error(err);
    }
  }

  filtro.addEventListener('change', buscarUsuarios);
  buscarUsuarios(); // busca inicial
});

// 📧 Mostrar dados pessoais na área principal
btnDadosPessoais.addEventListener('click', async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const usuarios = res.data;
    usuarioLogado = usuarios.find(u => u.id === Number(userId)); // ✅ atribuição correta

    if (!usuarioLogado) {
      userList.innerHTML = '<p>Usuário não encontrado.</p>';
      return;
    }

    userList.innerHTML = `
      <h2>Dados Pessoais</h2>
      <div class="perfil-item">
        <strong>Email:</strong> ${usuarioLogado.email}
        <button id="editarEmail">Editar</button>
      </div>
      <div class="perfil-item">
        <strong>Senha:</strong> ••••••••••••••••••
        <button id="editarSenha">Editar</button>
      </div>
      <div class="perfil-item">
        <strong>Disponibilidade:</strong> 
        <span id="statusDisponibilidade">${usuarioLogado.isAvailable ? '✅ Disponível' : '❌ Indisponível'}</span>
        <button id="toggleDisponibilidade">Alterar</button>
      </div>
    `;

    // ✏️ Editar email
    document.getElementById('editarEmail').addEventListener('click', () => {
      const novoEmail = prompt('Digite o novo email:');
      if (novoEmail) atualizarCampo({ email: novoEmail });
    });

    // ✏️ Editar senha
    document.getElementById('editarSenha').addEventListener('click', () => {
      const senhaAtual = prompt('Digite sua senha atual:');
      const senhaNova = prompt('Digite a nova senha:');
      if (senhaAtual && senhaNova) atualizarSenha(senhaAtual, senhaNova);
    });

    // ✅ Alterar disponibilidade
    document.getElementById('toggleDisponibilidade').addEventListener('click', async () => {
      try {
        const novoStatus = !usuarioLogado.isAvailable;
        const res = await axios.put(`http://localhost:3000/doacao/usuarios/${userId}/disponibilidade`, {
          isAvailable: novoStatus
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert(res.data.message || 'Disponibilidade atualizada!');
        btnDadosPessoais.click(); // recarrega os dados
      } catch (err) {
        alert('Erro ao atualizar disponibilidade');
        console.error(err);
      }
    });

  } catch (err) {
    userList.innerHTML = '<p>Erro ao carregar dados pessoais.</p>';
    console.error(err);
  }
});

// 🔄 Atualizar campo (email)
async function atualizarCampo(data) {
  try {
    const res = await axios.put(`http://localhost:3000/api/user/${userId}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert(res.data.message || 'Atualizado com sucesso!');
    btnDadosPessoais.click(); // recarrega os dados
  } catch (err) {
    alert('Erro ao atualizar');
    console.error(err);
  }
}

// 🔐 Atualizar senha
async function atualizarSenha(senhaAtual, senhaNova) {
  try {
    const res = await axios.put(`http://localhost:3000/api/user/${userId}/senha`, {
      senhaAtual,
      senhaNova
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert(res.data.message || 'Senha atualizada!');
  } catch (err) {
    alert('Erro ao atualizar senha');
    console.error(err);
  }
}

// 🚪 Logout
document.getElementById('btnLogout').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  window.location.href = 'index.html';
});
