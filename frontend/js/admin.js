


// --- FUNÇÃO DE SEGURANÇA ---
function escapeHTML(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// 1. Inicialização
document.addEventListener("DOMContentLoaded", () => {
    loadAdminPage('overview');
});

// 2. Mapeamento de Páginas do Admin
const adminPages = {
    overview: renderOverview,
    users: renderUserManagement,
    requests: renderBloodRequests
};

async function loadAdminPage(page, element) {
    // Atualiza classe ativa no menu
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    if (element) element.classList.add('active');

    if (adminPages[page]) {
        await adminPages[page]();
    }
}

// --- FUNÇÕES DE RENDERIZAÇÃO ---

async function renderOverview() {
    const content = document.getElementById("adminContent");
    content.innerHTML = `<h1>📊 Visão Geral</h1><p>Carregando estatísticas...</p>`;

    try {
        // Aqui buscaríamos estatísticas gerais do backend (ex: total de usuários, total de doações)
        // Por enquanto, vamos mostrar um layout de cards
        content.innerHTML = `
            <h1>📊 Visão Geral</h1>
            <div class="cards">
                <div class="card">
                    <h3>Total de Doadores</h3>
                    <p class="big" id="totalUsers">...</p>
                </div>
                <div class="card">
                    <h3>Disponíveis Hoje</h3>
                    <p class="big" id="availableNow" style="color: green;">...</p>
                </div>
            </div>
            <div class="impact-card">
                📢 Sistema BloodCare operando normalmente.
            </div>
        `;

        // Busca dados reais
        const users = await fetchAvailableDonors();
        document.getElementById("totalUsers").innerText = users.length;
        document.getElementById("availableNow").innerText = users.filter(u => u.availability === 'DISPONIVEL').length;

    } catch (error) {
        content.innerHTML = `<p style="color:red">Erro ao carregar visão geral.</p>`;
    }
}

async function renderUserManagement() {
    const content = document.getElementById("adminContent");
    content.innerHTML = `<h1>👥 Gerenciamento de Usuários</h1><p>Buscando base de dados...</p>`;

    try {
        const users = await fetchAvailableDonors(); // Reutilizando a rota de doadores

        content.innerHTML = `
            <h1>👥 Usuários Cadastrados</h1>
            <table class="donation-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Tipo Sanguíneo</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(u => `
                        <tr>
                            <td>${escapeHTML(u.name)}</td>
                            <td><span class="blood-badge">${u.bloodType.replace('_POS', '+').replace('_NEG', '-')}</span></td>
                            <td>${u.availability}</td>
                            <td>
                                <button onclick="alert('Funcionalidade de editar em breve')" class="btn-secondary" style="padding: 5px 10px; font-size: 12px;">Detalhes</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        content.innerHTML = `<p style="color:red">Erro ao carregar usuários.</p>`;
    }
}

async function renderBloodRequests() {
    const content = document.getElementById("adminContent");
    content.innerHTML = `
        <h1>🩸 Pedidos de Sangue</h1>
        <p>Área para gerenciar solicitações de hospitais ou urgências.</p>
        <div class="status-box warning">
            Esta funcionalidade requer integração com a tabela de Pedidos do Banco de Dados.
        </div>
        <button class="btn-primary" onclick="alert('Abrindo formulário de pedido...')">Criar Novo Pedido de Urgência</button>
    `;
}