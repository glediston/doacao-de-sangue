const token = localStorage.getItem('token');
const userList = document.getElementById('userList');

(function verificarAdmin(){
  if(!token) return negarAcesso('Faça login novamente.');
  try{
    const { isAdmin } = JSON.parse(atob(token.split('.')[1]));
    if(!isAdmin) return negarAcesso('Você não é administrador.');
  }catch{ return negarAcesso('Token inválido. Faça login novamente.'); }

  function negarAcesso(msg){ alert(`Acesso negado. ${msg}`); window.location.href='index.html'; }
})();

const btnBuscar = document.getElementById('btnBuscar');

btnBuscar.addEventListener('click', async ()=>{
  try{
    const res = await axios.get('http://localhost:3000/api/users', { headers:{ Authorization:`Bearer ${token}` } });
    userList.innerHTML='';
    if(res.data.length===0){ userList.innerHTML='<p>Nenhum usuário encontrado.</p>'; return; }
    res.data.forEach(user=>{
      const card=document.createElement('div');
      card.classList.add('user-card');
      card.innerHTML=`
        <div class="user-info"><strong>${user.name}</strong> — ${user.email}</div>
        <div class="actions">
          <button class="btn-update" onclick='openUpdateModal(${JSON.stringify(user)})'>Atualizar</button>
          <button class="btn-delete" onclick='deleteUser(${user.id})'>Apagar</button>
        </div>
      `;
      userList.appendChild(card);
    });
  }catch(err){ alert('Erro ao buscar usuários'); console.error(err); }
});

// Modal update
let currentUserId=null;
function openUpdateModal(user){
  currentUserId=user.id;
  document.getElementById('upd-name').value=user.name||'';
  document.getElementById('upd-email').value=user.email||'';
  document.getElementById('upd-password').value='';
  document.getElementById('updateModal').style.display='block';
}
function closeUpdateModal(){ document.getElementById('updateModal').style.display='none'; }

async function saveUpdate(){
  const name=document.getElementById('upd-name').value;
  const email=document.getElementById('upd-email').value;
  const password=document.getElementById('upd-password').value;
  if(!name&&!email&&!password){ alert('Digite pelo menos um campo!'); return; }
  try{
    await axios.put(`http://localhost:3000/api/user/${currentUserId}`, {name,email,password},{headers:{Authorization:`Bearer ${token}`}});
    alert('Usuário atualizado!');
    closeUpdateModal(); btnBuscar.click();
  }catch(err){ console.error(err); alert('Erro ao atualizar'); }
}

document.getElementById('btnSaveUpdate').addEventListener('click', saveUpdate);
document.getElementById('btnLogout').addEventListener('click', ()=>{
  localStorage.clear(); window.location.href='index.html';
});

// Função delete
async function deleteUser(id){
  if(!confirm('Deseja realmente deletar este usuário?')) return;
  try{
    await axios.delete(`http://localhost:3000/api/user/${id}`,{headers:{Authorization:`Bearer ${token}`}});
    alert('Usuário deletado!'); btnBuscar.click();
  }catch(err){ alert('Erro ao deletar usuário'); console.error(err); }
}
