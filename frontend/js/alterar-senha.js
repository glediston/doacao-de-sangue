

document.getElementById('formAlterarSenha').addEventListener('submit', async (e) => {
  e.preventDefault();

  const senhaAtual = document.getElementById('senhaAtual').value;
  const senhaNova = document.getElementById('senhaNova').value;
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  try {
    const res = await fetch(`http://localhost:3000/api/user/${userId}/senha`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ senhaAtual, senhaNova })
    });

    const data = await res.json();
    alert(data.message || 'Senha atualizada!');
    window.location.href = 'user.html';
  } catch (err) {
    alert('Erro ao atualizar senha');
  }
});
