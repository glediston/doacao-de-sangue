


// --- FUNÇÃO DE SEGURANÇA CONTRA XSS ---
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
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
        showHome(userData.name);
    }
});

// 2. Mapeamento de Páginas
const pages = {
    home: () => {
        const userData = JSON.parse(localStorage.getItem("user"));
        showHome(userData.name);
    },
    status: renderStatus,
    donations: renderDonationHistory,
    register: renderNewDonationForm,
    profile: renderProfile,
    search: renderSearch,
    requestBlood: renderBloodRequestForm // Nova função
};

// 3. Função Principal de Navegação
async function loadPage(page, element) {
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    if (element) element.classList.add('active');

    if (pages[page]) {
        await pages[page]();
    }
}

// --- FUNÇÕES DE RENDERIZAÇÃO ---

function showHome(name) {
    const content = document.getElementById("dynamicContent");
    content.innerHTML = `
        <h1>Bem-vindo, ${escapeHTML(name)}!</h1>
        <p>Use o menu lateral para gerenciar suas doações e seu status.</p>
    `;
}

async function renderStatus() {
    const content = document.getElementById("dynamicContent");
    content.innerHTML = `<h1>❤️ Status de Doação</h1><p>Consultando servidor...</p>`;
    try {
        const status = await fetchDonationStatus();
        if (!status.lastDonation) {
            content.innerHTML = `
                <div class="status-card success">
                    <h1>❤️ Status: Disponível</h1>
                    <p>Você ainda não registrou doações. Comece hoje!</p>
                    <button onclick="loadPage('register')" class="btn-primary">Registrar Primeira Doação</button>
                </div>`;
            return;
        }
        const lastDate = new Date(status.lastDonation).toLocaleDateString('pt-BR');
        content.innerHTML = `
            <div class="status-container">
                <h1>❤️ Status: ${status.canDonate ? '<span style="color:green">Disponível</span>' : '<span style="color:orange">Em Repouso</span>'}</h1>
                <div class="status-details">
                    <p><strong>Sua última doação:</strong> ${escapeHTML(lastDate)}</p>
                    <p><strong>Dias passados:</strong> ${status.daysSinceLastDonation}</p>
                    <p><strong>Intervalo necessário:</strong> ${status.requiredInterval} dias</p>
                </div>
                ${status.canDonate 
                    ? `<p class="msg-success">✅ Intervalo completo! Você já pode doar novamente.</p>
                       <button onclick="loadPage('register')" class="btn-primary">Registrar Nova Doação</button>`
                    : `<div class="msg-wait">
                        <p>⏳ Faltam <strong>${status.daysRemaining} dias</strong> para sua próxima doação.</p>
                       </div>`
                }
            </div>
        `;
    } catch (error) {
        content.innerHTML = `<p style="color:red">Erro ao carregar status. Tente novamente mais tarde.</p>`;
    }
}

async function renderDonationHistory() {
    const content = document.getElementById("dynamicContent");
    content.innerHTML = `<h1>📅 Minhas Doações</h1><p>Carregando...</p>`;
    try {
        const donations = await fetchDonations();
        if (donations.length === 0) {
            content.innerHTML = `
                <h1>📅 Minhas Doações</h1>
                <p>Nenhuma doação encontrada.</p>
                <button onclick="loadPage('register')" class="btn-primary">Registrar Doação</button>`;
            return;
        }
        content.innerHTML = `
            <div class="header-actions">
                <h1>📅 Minhas Doações</h1>
                <button onclick="loadPage('register')" class="btn-primary">+ Nova Doação</button>
            </div>
            <table class="donation-table">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Local</th>
                        <th>Quantidade</th>
                        <th>Notas</th>
                    </tr>
                </thead>
                <tbody>
                    ${donations.map(d => `
                        <tr>
                            <td>${new Date(d.date).toLocaleDateString('pt-BR')}</td>
                            <td>${escapeHTML(d.location) || 'Não informado'}</td>
                            <td><strong>${d.quantity}ml</strong></td>
                            <td>${escapeHTML(d.notes) || '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>`;
    } catch (error) {
        content.innerHTML = `<p style="color:red">Erro ao buscar histórico.</p>`;
    }
}

function renderNewDonationForm() {
    const content = document.getElementById("dynamicContent");
    content.innerHTML = `
        <h1>📝 Registrar Doação</h1>
        <form id="donationForm" class="form-container">
            <label>Local (Hemocentro):</label>
            <input type="text" id="donLocation" placeholder="Ex: Hemoba">
            <label>Quantidade (ml):</label>
            <input type="number" id="donQuantity" value="450">
            <label>Destinatário (Opcional):</label>
            <input type="text" id="donRecipient" placeholder="Ex: Doação Voluntária">
            <label>Notas:</label>
            <textarea id="donNotes" placeholder="Como você se sentiu? Alguma observação?"></textarea>
            <div class="form-buttons">
                <button type="button" id="btnSalvarDoacao" class="btn-save" onclick="handleDonationSubmit()">Salvar Doação</button>
                <button type="button" class="btn-cancel" onclick="loadPage('donations')">Cancelar</button>
            </div>
        </form>
        <p id="donError" style="color:red; margin-top: 10px;"></p>
    `;
}

async function handleDonationSubmit() {
    const btnSalvar = document.getElementById("btnSalvarDoacao");
    const errorMsg = document.getElementById("donError");
    const data = {
        location: document.getElementById("donLocation").value.trim(),
        quantity: parseInt(document.getElementById("donQuantity").value),
        recipient: document.getElementById("donRecipient").value.trim(),
        notes: document.getElementById("donNotes").value.trim()
    };
    try {
        btnSalvar.disabled = true;
        btnSalvar.innerText = "Salvando...";
        await registerDonation(data);
        alert("✅ Doação registrada com sucesso!");
        loadPage('donations');
    } catch (err) {
        errorMsg.innerText = "Erro ao salvar doação. Verifique os dados.";
    } finally {
        if(btnSalvar) {
            btnSalvar.disabled = false;
            btnSalvar.innerText = "Salvar Doação";
        }
    }
}

async function renderProfile() {
    const content = document.getElementById("dynamicContent");
    const userData = JSON.parse(localStorage.getItem("user"));
    const displayBloodType = userData.bloodType ? userData.bloodType.replace('_POS', '+').replace('_NEG', '-') : 'N/A';
    content.innerHTML = `
        <div class="profile-container">
            <h1>👤 Meu Perfil</h1>
            <div class="profile-card">
                <h3>Dados Pessoais</h3>
                <label>Nome:</label>
                <input type="text" id="updateName" class="form-input" value="${escapeHTML(userData.name)}">
                <label>Email:</label>
                <input type="email" id="updateEmail" class="form-input" value="${escapeHTML(userData.email)}">
                <p><strong>Tipo Sanguíneo:</strong> <span class="blood-badge">${escapeHTML(displayBloodType)}</span></p>
                <hr>
                <h3>Minha Disponibilidade</h3>
                <select id="updateStatusSelect" class="status-select">
                    <option value="DISPONIVEL" ${userData.availability === 'DISPONIVEL' ? 'selected' : ''}>Disponível para doar</option>
                    <option value="INDISPONIVEL" ${userData.availability === 'INDISPONIVEL' ? 'selected' : ''}>Indisponível no momento</option>
                    <option value="PRECISANDO_DOAR" ${userData.availability === 'PRECISANDO_DOAR' ? 'selected' : ''}>🚨 Estou precisando de doação</option>
                </select>
                <button id="btnAtualizarPerfil" onclick="handleUpdateProfile()" class="btn-primary" style="margin-top: 20px; width: 100%;">Salvar Alterações</button>
                <p id="profileMessage" style="margin-top:10px; font-weight: bold;"></p>
            </div>
        </div>
    `;
}

async function handleUpdateProfile() {
    const userData = JSON.parse(localStorage.getItem("user"));
    const msgArea = document.getElementById("profileMessage");
    const btn = document.getElementById("btnAtualizarPerfil");
    const updatedData = {
        name: document.getElementById("updateName").value.trim(),
        email: document.getElementById("updateEmail").value.trim(),
        availability: document.getElementById("updateStatusSelect").value
    };
    try {
        btn.disabled = true;
        btn.innerText = "Salvando...";
        const response = await api.put(`/api/donors/usuarios/${userData.id}/disponibilidade`, updatedData);
        const newUserState = { ...userData, ...updatedData };
        localStorage.setItem("user", JSON.stringify(newUserState));
        msgArea.style.color = "green";
        msgArea.innerText = "✅ Perfil atualizado com sucesso!";
    } catch (err) {
        msgArea.style.color = "red";
        msgArea.innerText = "❌ Erro ao atualizar perfil.";
    } finally {
        btn.disabled = false;
        btn.innerText = "Salvar Alterações";
    }
}

async function renderSearch() {
    const content = document.getElementById("dynamicContent");
    content.innerHTML = `
        <div class="search-header">
            <h1>🔍 Buscar na Rede BloodCare</h1>
            <p>Encontre doadores disponíveis ou pessoas que precisam de ajuda.</p>
            <div style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 25px; display: flex; gap: 10px;">
                <select id="searchStatusFilter" class="status-select" style="flex: 1;">
                    <option value="DISPONIVEL">😇 Doadores Disponíveis</option>
                    <option value="PRECISANDO_DOAR">🚨 Quem precisa de doação</option>
                </select>
                <button onclick="handleSearch()" class="btn-primary" style="width: auto; padding: 0 30px;">Buscar</button>
            </div>
        </div>
        <div id="searchResults" class="results-grid">
            <p style="text-align: center; color: #666;">Selecione uma opção acima para pesquisar.</p>
        </div>
    `;
}

async function handleSearch() {
    const status = document.getElementById("searchStatusFilter").value;
    const resultsArea = document.getElementById("searchResults");
    resultsArea.innerHTML = "<p>Carregando...</p>";
    try {
        const response = await api.get(`/api/donors/usuarios-disponiveis?status=${status}`);
        const users = response.data;
        if (users.length === 0) {
            resultsArea.innerHTML = "<p>Nenhum usuário encontrado.</p>";
            return;
        }
        resultsArea.innerHTML = users.map(user => `
            <div class="user-card" style="border: 1px solid #eee; background: #fff; padding: 20px; border-radius: 12px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                <div>
                    <h3 style="margin: 0 0 5px 0; color: #333;">${escapeHTML(user.name)}</h3>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span class="blood-badge">${user.bloodType ? user.bloodType.replace('_POS', '+').replace('_NEG', '-') : 'S/T'}</span>
                        <span style="font-size: 14px; color: #666;">${escapeHTML(user.email)}</span>
                    </div>
                </div>
                <a href="mailto:${user.email}" class="btn-primary" style="width: auto; padding: 10px 20px; text-decoration: none; font-size: 14px;">✉️ Contatar</a>
            </div>
        `).join('');
    } catch (err) {
        resultsArea.innerHTML = "<p style='color:red'>Erro ao buscar dados.</p>";
    }
}

function renderBloodRequestForm() {
    const content = document.getElementById("dynamicContent");
    const userData = JSON.parse(localStorage.getItem("user"));
    
    content.innerHTML = `
        <h1>🚨 Criar Pedido de Doação Urgente</h1>
        <p>Preencha os dados abaixo para que outros doadores saibam da sua necessidade.</p>
        
        <form id="requestForm" class="form-container">
            <label>Tipo Sanguíneo Necessário:</label>
            <select id="reqBloodType" class="status-select">
                <option value="${userData.bloodType}">${userData.bloodType.replace('_POS', '+').replace('_NEG', '-')} (Meu Tipo)</option>
                <option value="O_NEG">O-</option>
                <option value="O_POS">O+</option>
                <option value="A_NEG">A-</option>
                <option value="A_POS">A+</option>
                <option value="B_NEG">B-</option>
                <option value="B_POS">B+</option>
                <option value="AB_NEG">AB-</option>
                <option value="AB_POS">AB+</option>
            </select>

            <label>Local/Hospital:</label>
            <input type="text" id="reqLocation" placeholder="Ex: Hospital Aliança ou Hemocentro Central" required>

            <label>Descrição / Motivo (Opcional):</label>
            <textarea id="reqDescription" placeholder="Explique brevemente a situação..."></textarea>

            <div class="form-buttons">
                <button type="button" id="btnCriarPedido" class="btn-primary" onclick="handleRequestSubmit()">Publicar Pedido</button>
                <button type="button" class="btn-cancel" onclick="loadPage('home')">Cancelar</button>
            </div>
        </form>
        <p id="reqError" style="color:red; margin-top: 10px;"></p>
    `;
}



// ... (mantenha as outras funções)

async function handleRequestSubmit() {
    const btn = document.getElementById("btnCriarPedido");
    const errorMsg = document.getElementById("reqError");
    const userData = JSON.parse(localStorage.getItem("user"));

    // O objeto 'data' deve bater EXATAMENTE com o que o Repository espera
    const data = {
        requester: userData.name, // Nome do usuário logado
        bloodType: document.getElementById("reqBloodType").value,
        location: document.getElementById("reqLocation").value.trim(),
        message: document.getElementById("reqDescription").value.trim() // 'message' conforme o Prisma
    };

    if (!data.location) {
        errorMsg.innerText = "Por favor, informe o local.";
        return;
    }

    try {
        btn.disabled = true;
        btn.innerText = "Publicando...";
        
        // 1. Cria o pedido na tabela RequestBlood
        await createBloodRequest(data);
        
        // 2. Opcional: Atualiza o status do doador para destacar no mapa/busca
        await updateMyAvailability(userData.id, 'PRECISANDO_DOAR');
        
        // 3. Atualiza o localStorage para o ícone de alerta aparecer no perfil sem dar F5
        userData.availability = 'PRECISANDO_DOAR';
        localStorage.setItem("user", JSON.stringify(userData));

        alert("🚨 Pedido criado com sucesso! Sua necessidade agora está visível.");
        loadPage('home');
    } catch (err) {
        console.error(err);
        errorMsg.innerText = "Erro ao criar pedido. Verifique os campos.";
    } finally {
        btn.disabled = false;
        btn.innerText = "Publicar Pedido";
    }
}