

const userList = document.getElementById('userList');
const btnBuscar = document.getElementById('btnBuscar');

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
          <button class="btn-update" onclick="updateUser(${user.id})">Atualizar</button>
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
