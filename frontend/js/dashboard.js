


// --- FUNÇÃO DE SEGURANÇA CONTRA XSS ---
// Impede que tags HTML inseridas pelos usuários sejam executadas no navegador
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
    profile: renderProfile
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

        // ✅ SEGURANÇA: escapeHTML no location e notes
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
        errorMsg.innerText = "";

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
    const displayBloodType = userData.bloodType.replace('_POS', '+').replace('_NEG', '-');

    content.innerHTML = `
        <div class="profile-container">
            <h1>👤 Meu Perfil</h1>
            <div class="profile-card">
                <p><strong>Nome:</strong> ${escapeHTML(userData.name)}</p>
                <p><strong>Email:</strong> ${escapeHTML(userData.email)}</p>
                <p><strong>Tipo Sanguíneo:</strong> <span class="blood-badge">${escapeHTML(displayBloodType)}</span></p>
                
                <hr>
                
                <h3>Minha Disponibilidade</h3>
                <p>Como você deseja aparecer para quem precisa de sangue?</p>
                
                <select id="updateStatusSelect" class="status-select">
                    <option value="DISPONIVEL" ${userData.availability === 'DISPONIVEL' ? 'selected' : ''}>Disponível para doar</option>
                    <option value="INDISPONIVEL" ${userData.availability === 'INDISPONIVEL' ? 'selected' : ''}>Indisponível no momento</option>
                    <option value="PRECISANDO_DOAR" ${userData.availability === 'PRECISANDO_DOAR' ? 'selected' : ''}>🚨 Estou precisando de doação</option>
                </select>
                
                <button id="btnAtualizarStatus" onclick="handleUpdateAvailability()" class="btn-secondary" style="margin-top: 10px;">Atualizar Disponibilidade</button>
                <p id="profileMessage" style="margin-top:10px; font-weight: bold;"></p>
            </div>
        </div>
    `;
}

async function handleUpdateAvailability() {
    const userData = JSON.parse(localStorage.getItem("user"));
    const newStatus = document.getElementById("updateStatusSelect").value;
    const msgArea = document.getElementById("profileMessage");
    const btn = document.getElementById("btnAtualizarStatus");

    try {
        btn.disabled = true;
        btn.innerText = "Atualizando...";

        await updateMyAvailability(userData.id, newStatus);
        
        // Atualização local imediata
        userData.availability = newStatus;
        localStorage.setItem("user", JSON.stringify(userData));
        
        msgArea.style.color = "green";
        msgArea.innerText = "✅ Status atualizado com sucesso!";
    } catch (err) {
        msgArea.style.color = "red";
        msgArea.innerText = "❌ Erro ao atualizar status.";
    } finally {
        btn.disabled = false;
        btn.innerText = "Atualizar Disponibilidade";
    }
}