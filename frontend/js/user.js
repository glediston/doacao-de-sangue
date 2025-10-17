

const token = localStorage.getItem('token');
const btnBuscar = document.getElementById('btnBuscar');
const userList = document.getElementById('userList');

btnBuscar.addEventListener('click', async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const users = res.data;
    userList.innerHTML = '<h2>Doadores disponíveis:</h2>';

    users.forEach(user => {
      const card = document.createElement('div');
      card.classList.add('user-card');
      card.innerHTML = `
        <div class="user-info">
          <strong>${user.name}</strong> — ${user.email}
        </div>
      `;
      userList.appendChild(card);
    });
  } catch (err) {
    alert('Erro ao buscar usuários');
    console.error(err);
  }
});
