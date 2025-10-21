

const userList = document.getElementById('userList');
const btnBuscar = document.getElementById('btnBuscar');
const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');


(function verificarAdmin() {
  const token = localStorage.getItem('token');
  if (!token) return negarAcesso('Faça login novamente.');

  try {
    const { isAdmin } = JSON.parse(atob(token.split('.')[1]));
    if (!isAdmin) return negarAcesso('Você não é administrador.');
  } catch {
    return negarAcesso('Token inválido. Faça login novamente.');
  }

  function negarAcesso(msg) {
    alert(`Acesso negado. ${msg}`);
    window.location.href = 'index.html';
  }
})();




btnBuscar.addEventListener('click', async () => {
  const token = localStorage.getItem('token'); // ← pega o token salvo no login

  try {
    const res = await axios.get('http://localhost:3000/api/users', {
      headers: {
        Authorization: `Bearer ${token}` // ← envia o token no cabeçalho
      }
    });

    const users = res.data;
    userList.innerHTML = '';

    if (users.length === 0) {
      userList.innerHTML = '<p>Nenhum usuário encontrado.</p>';
      return;
    }

    users.forEach(user => {
      const card = document.createElement('div');
      card.classList.add('user-card');
      card.innerHTML = `
        <div class="user-info">
          <strong>${user.name}</strong> — ${user.email}
        </div>
        <div class="actions">
         <button class="btn-update" onclick='openUpdateModal(${JSON.stringify(user)})'>Atualizar</button>
          <button class="btn-delete" onclick="deleteUser(${user.id})">Apagar</button>
        </div>
      `;
      userList.appendChild(card);
    });
  } catch (err) {
    alert('Erro ao buscar usuários');
    console.error(err); // ← mostra o erro no console para depurar
  }
});




//update user(id)
let currentUserId = null;

function openUpdateModal(user) {
  currentUserId = user.id;

  document.getElementById('upd-name').value = user.name || '';
  document.getElementById('upd-email').value = user.email || '';
  document.getElementById('upd-password').value = '';

  document.getElementById('updateModal').style.display = 'block';
}

function closeUpdateModal() {
  document.getElementById('updateModal').style.display = 'none';
}

async function saveUpdate() {
  const name = document.getElementById('upd-name').value;
  const email = document.getElementById('upd-email').value;
  const password = document.getElementById('upd-password').value;
  const token = localStorage.getItem('token');

  if (!name && !email && !password) {
    alert('Digite pelo menos um campo para atualizar!');
    return;
  }

  try {
    await axios.put(
      `http://localhost:3000/api/user/${currentUserId}`,
      { name, email, password },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert('Usuário atualizado com sucesso!');
    closeUpdateModal();
    btnBuscar.click(); // recarrega a lista
  } catch (err) {
    console.error(err);
    alert('Erro ao atualizar usuário');
  }
}

document.getElementById('btnSaveUpdate').addEventListener('click', saveUpdate);

