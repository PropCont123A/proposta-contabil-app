/* Sistema Proposta Contábil - JavaScript Principal */

// ===== VARIÁVEIS GLOBAIS =====
let currentTab = 0;
let serviceCounter = 0;
let editingClientIndex = -1;

// ===== FUNÇÕES DE AUTENTICAÇÃO =====
function checkAuth() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
        return;
    }
    
    const currentUser = localStorage.getItem('currentUser') || 'Usuário';
    const welcomeElement = document.getElementById('welcomeUser');
    const avatarElement = document.getElementById('userAvatar');
    
    if (welcomeElement) {
        welcomeElement.textContent = `Bem-vindo, ${currentUser}!`;
    }
    
    if (avatarElement) {
        avatarElement.textContent = currentUser.charAt(0).toUpperCase();
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// ===== FUNÇÕES DE LOGIN =====
function showTab(tabName) {
    // Esconder todas as abas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remover active de todos os botões
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar aba selecionada
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Ativar botão correspondente
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

function login(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    // Verificar credenciais padrão
    if (username === 'admin' && password === '123456') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', username);
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Verificar usuários cadastrados
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', user.name);
        window.location.href = 'dashboard.html';
    } else {
        alert('Usuário ou senha incorretos.');
    }
}

function register(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const username = document.getElementById('registerUser').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    if (!name || !username || !password || !confirmPassword) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('As senhas não coincidem.');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Verificar se usuário já existe
    if (users.find(u => u.username === username)) {
        alert('Este usuário já existe.');
        return;
    }
    
    // Adicionar novo usuário
    users.push({
        name: name,
        username: username,
        password: password
    });
    
    localStorage.setItem('users', JSON.stringify(users));
    alert('Usuário cadastrado com sucesso!');
    
    // Limpar formulário e voltar para login
    document.getElementById('registerForm').reset();
    showTab('login');
}

// ===== FUNÇÕES DO MENU LATERAL =====
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleBtn');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }
}

// ===== FUNÇÕES DO DASHBOARD =====
function loadDashboardStats() {
    const propostas = JSON.parse(localStorage.getItem('propostas') || '[]');
    
    // Calcular estatísticas
    const enviadas = propostas.filter(p => p.status === 'enviada').length;
    const negociacao = propostas.filter(p => p.status === 'negociacao').length;
    const contratadas = propostas.filter(p => p.status === 'contratada').length;
    const total = propostas.length;
    const conversao = total > 0 ? Math.round((contratadas / total) * 100) : 0;
    
    // Atualizar elementos do DOM
    const elements = {
        'stat-enviadas': enviadas,
        'stat-negociacao': negociacao,
        'stat-contratadas': contratadas,
        'stat-conversao': conversao + '%'
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

// ===== FUNÇÕES DE NAVEGAÇÃO ENTRE ABAS =====
function showTabByIndex(index) {
    const tabs = ['dados-cliente', 'servicos', 'condicoes', 'resumo'];
    const tabButtons = document.querySelectorAll('.tab-button');
    
    // Esconder todas as abas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remover active de todos os botões
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar aba atual
    const targetTab = document.getElementById(tabs[index]);
    if (targetTab) {
        targetTab.classList.add('active');
        if (tabButtons[index]) {
            tabButtons[index].classList.add('active');
        }
    }
    
    // Se for a aba de resumo, atualizar o conteúdo
    if (index === 3) {
        updateSummary();
    }
}

function nextTab() {
    const tabs = ['dados-cliente', 'servicos', 'condicoes', 'resumo'];
    if (currentTab < tabs.length - 1) {
        currentTab++;
        showTabByIndex(currentTab);
    }
}

function prevTab() {
    if (currentTab > 0) {
        currentTab--;
        showTabByIndex(currentTab);
    }
}

// ===== FUNÇÕES DE GERENCIAMENTO DE SERVIÇOS =====
function addService() {
    serviceCounter++;
    const container = document.getElementById('servicos-container');
    
    if (!container) return;
    
    const serviceDiv = document.createElement('div');
    serviceDiv.className = 'service-item';
    serviceDiv.id = `service-${serviceCounter}`;
    
    serviceDiv.innerHTML = `
        <div class="service-header">
            <input type="text" class="service-title-input" placeholder="Nome do serviço" required>
            <input type="text" class="service-value-input" placeholder="R$ 0,00" required>
            <button type="button" class="btn-remove-service" onclick="removeService(${serviceCounter})">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="service-descriptions">
            <div class="description-item">
                <input type="text" placeholder="Descrição do serviço">
                <button type="button" class="btn-add-description" onclick="addDescription(${serviceCounter})">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
    `;
    
    container.appendChild(serviceDiv);
}

function removeService(id) {
    const element = document.getElementById(`service-${id}`);
    if (element) {
        element.remove();
    }
}

function addDescription(serviceId) {
    const descriptionsContainer = document.querySelector(`#service-${serviceId} .service-descriptions`);
    
    if (!descriptionsContainer) return;
    
    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'description-item';
    descriptionDiv.innerHTML = `
        <input type="text" placeholder="Descrição do serviço">
        <button type="button" class="btn-remove-description" onclick="removeDescription(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    descriptionsContainer.appendChild(descriptionDiv);
}

function removeDescription(button) {
    button.parentElement.remove();
}

// ===== FUNÇÕES DE RESUMO =====
function toggleSummary() {
    const content = document.getElementById('summary-content');
    const icon = document.querySelector('.summary-header i');
    
    if (content) {
        content.classList.toggle('active');
    }
    
    if (icon) {
        icon.classList.toggle('fa-chevron-down');
        icon.classList.toggle('fa-chevron-up');
    }
}

function updateSummary() {
    const summaryContent = document.getElementById('summary-content');
    
    if (!summaryContent) return;
    
    // Coletar dados do cliente
    const nomeCliente = document.getElementById('nomeCliente')?.value || '';
    const emailCliente = document.getElementById('emailCliente')?.value || '';
    
    // Coletar serviços
    const services = [];
    let total = 0;
    
    document.querySelectorAll('.service-item').forEach(service => {
        const title = service.querySelector('.service-title-input')?.value || '';
        const value = service.querySelector('.service-value-input')?.value || '';
        const descriptions = [];
        
        service.querySelectorAll('.description-item input').forEach(desc => {
            if (desc.value) descriptions.push(desc.value);
        });
        
        if (title && value) {
            const numericValue = parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
            total += numericValue;
            
            services.push({
                title,
                value,
                descriptions
            });
        }
    });
    
    // Gerar HTML do resumo
    let html = `
        <h4>Cliente: ${nomeCliente}</h4>
        <p>E-mail: ${emailCliente}</p>
        <hr>
        <h4>Serviços:</h4>
    `;
    
    services.forEach(service => {
        html += `
            <div style="margin-bottom: 15px;">
                <strong>${service.title}</strong> - ${service.value}
                <ul>
        `;
        service.descriptions.forEach(desc => {
            html += `<li>${desc}</li>`;
        });
        html += `</ul></div>`;
    });
    
    html += `
        <hr>
        <h4>Total: R$ ${total.toFixed(2).replace('.', ',')}</h4>
    `;
    
    summaryContent.innerHTML = html;
}

// ===== FUNÇÕES DE COMPARTILHAMENTO =====
function generatePDF() {
    alert('Funcionalidade de PDF será implementada em breve!');
}

function generateLink() {
    // Simular geração de link
    const propostaId = Date.now().toString();
    const link = `${window.location.origin}/proposta.html?id=${propostaId}`;
    
    navigator.clipboard.writeText(link).then(() => {
        alert(`Link copiado para a área de transferência:\n${link}`);
    });
}

function sendEmail() {
    alert('Funcionalidade de envio por e-mail será implementada em breve!');
}

// ===== FUNÇÕES DE SALVAMENTO DE PROPOSTA =====
function saveProposta() {
    // Coletar todos os dados
    const proposta = {
        id: Date.now().toString(),
        cliente: {
            nome: document.getElementById('nomeCliente')?.value || '',
            cnpj: document.getElementById('cnpjCliente')?.value || '',
            email: document.getElementById('emailCliente')?.value || '',
            telefone: document.getElementById('telefoneCliente')?.value || '',
            endereco: document.getElementById('enderecoCliente')?.value || '',
            cidade: document.getElementById('cidadeCliente')?.value || ''
        },
        servicos: [],
        condicoes: {
            formaPagamento: document.getElementById('formaPagamento')?.value || '',
            prazoEntrega: document.getElementById('prazoEntrega')?.value || '',
            validadeProposta: document.getElementById('validadeProposta')?.value || '',
            observacoes: document.getElementById('observacoes')?.value || ''
        },
        dataGeracao: new Date().toLocaleDateString(),
        status: 'enviada'
    };
    
    // Coletar serviços
    document.querySelectorAll('.service-item').forEach(service => {
        const title = service.querySelector('.service-title-input')?.value || '';
        const value = service.querySelector('.service-value-input')?.value || '';
        const descriptions = [];
        
        service.querySelectorAll('.description-item input').forEach(desc => {
            if (desc.value) descriptions.push(desc.value);
        });
        
        if (title && value) {
            proposta.servicos.push({
                titulo: title,
                valor: value,
                descricoes: descriptions
            });
        }
    });
    
    // Salvar no localStorage
    const propostas = JSON.parse(localStorage.getItem('propostas') || '[]');
    propostas.push(proposta);
    localStorage.setItem('propostas', JSON.stringify(propostas));
    
    alert('Proposta salva com sucesso!');
    window.location.href = 'minhas-propostas.html';
}

// ===== FUNÇÕES DE PROPOSTAS =====
function loadProposals() {
    const propostas = JSON.parse(localStorage.getItem('propostas') || '[]');
    const proposalsList = document.getElementById('proposalsList');
    
    if (!proposalsList) return;
    
    if (propostas.length === 0) {
        proposalsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <h3>Nenhuma proposta encontrada</h3>
                <p>Você ainda não criou nenhuma proposta. Comece criando sua primeira proposta!</p>
                <a href="gerar-proposta.html" class="btn-new-proposal">
                    <i class="fas fa-plus"></i>
                    Criar Primeira Proposta
                </a>
            </div>
        `;
        return;
    }
    
    let html = '';
    propostas.forEach((proposta, index) => {
        const valorTotal = proposta.servicos.reduce((total, servico) => {
            const valor = parseFloat(servico.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
            return total + valor;
        }, 0);
        
        html += `
            <div class="proposal-item" data-status="${proposta.status}" data-client="${proposta.cliente.nome.toLowerCase()}" data-date="${proposta.dataGeracao}">
                <div class="proposal-header">
                    <div class="proposal-info">
                        <div class="proposal-title">Proposta #${proposta.id.slice(-6)}</div>
                        <div class="proposal-client">${proposta.cliente.nome}</div>
                        <div class="proposal-meta">
                            <span><i class="fas fa-calendar"></i> ${proposta.dataGeracao}</span>
                            <span><i class="fas fa-dollar-sign"></i> R$ ${valorTotal.toFixed(2).replace('.', ',')}</span>
                            <span><i class="fas fa-envelope"></i> ${proposta.cliente.email}</span>
                        </div>
                    </div>
                    <div class="proposal-actions">
                        <span class="proposal-status status-${proposta.status}">${getStatusText(proposta.status)}</span>
                        <button class="btn-action" onclick="viewProposal(${index})" title="Visualizar">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-action" onclick="editProposal(${index})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action" onclick="duplicateProposal(${index})" title="Duplicar">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn-action delete" onclick="deleteProposal(${index})" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    proposalsList.innerHTML = html;
}

function getStatusText(status) {
    const statusMap = {
        'enviada': 'Enviada',
        'negociacao': 'Em Negociação',
        'contratada': 'Contratada',
        'rejeitada': 'Rejeitada'
    };
    return statusMap[status] || status;
}

function filterProposals() {
    const statusFilter = document.getElementById('filterStatus')?.value || '';
    const clientFilter = document.getElementById('filterClient')?.value.toLowerCase() || '';
    const periodFilter = document.getElementById('filterPeriod')?.value || '';
    
    const proposalItems = document.querySelectorAll('.proposal-item');
    
    proposalItems.forEach(item => {
        let show = true;
        
        // Filtro por status
        if (statusFilter && item.dataset.status !== statusFilter) {
            show = false;
        }
        
        // Filtro por cliente
        if (clientFilter && !item.dataset.client.includes(clientFilter)) {
            show = false;
        }
        
        // Filtro por período (implementação básica)
        if (periodFilter) {
            const itemDate = new Date(item.dataset.date.split('/').reverse().join('-'));
            const today = new Date();
            
            switch (periodFilter) {
                case 'hoje':
                    if (itemDate.toDateString() !== today.toDateString()) {
                        show = false;
                    }
                    break;
                case 'semana':
                    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    if (itemDate < weekAgo) {
                        show = false;
                    }
                    break;
                case 'mes':
                    if (itemDate.getMonth() !== today.getMonth() || itemDate.getFullYear() !== today.getFullYear()) {
                        show = false;
                    }
                    break;
                case 'ano':
                    if (itemDate.getFullYear() !== today.getFullYear()) {
                        show = false;
                    }
                    break;
            }
        }
        
        item.style.display = show ? 'block' : 'none';
    });
}

function viewProposal(index) {
    const propostas = JSON.parse(localStorage.getItem('propostas') || '[]');
    const proposta = propostas[index];
    
    if (!proposta) return;
    
    const valorTotal = proposta.servicos.reduce((total, servico) => {
        const valor = parseFloat(servico.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        return total + valor;
    }, 0);
    
    let servicosHtml = '';
    proposta.servicos.forEach(servico => {
        servicosHtml += `
            <div style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <h4 style="color: #0000CB; margin-bottom: 10px;">${servico.titulo} - ${servico.valor}</h4>
                <ul>
        `;
        servico.descricoes.forEach(desc => {
            servicosHtml += `<li>${desc}</li>`;
        });
        servicosHtml += `</ul></div>`;
    });
    
    const modalContent = document.getElementById('modalContent');
    if (modalContent) {
        modalContent.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h3>Cliente</h3>
                <p><strong>Nome:</strong> ${proposta.cliente.nome}</p>
                <p><strong>CNPJ/CPF:</strong> ${proposta.cliente.cnpj}</p>
                <p><strong>E-mail:</strong> ${proposta.cliente.email}</p>
                <p><strong>Telefone:</strong> ${proposta.cliente.telefone}</p>
                ${proposta.cliente.endereco ? `<p><strong>Endereço:</strong> ${proposta.cliente.endereco}</p>` : ''}
                ${proposta.cliente.cidade ? `<p><strong>Cidade:</strong> ${proposta.cliente.cidade}</p>` : ''}
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3>Serviços</h3>
                ${servicosHtml}
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3>Condições</h3>
                <p><strong>Forma de Pagamento:</strong> ${proposta.condicoes.formaPagamento}</p>
                <p><strong>Prazo de Entrega:</strong> ${proposta.condicoes.prazoEntrega}</p>
                <p><strong>Validade da Proposta:</strong> ${proposta.condicoes.validadeProposta}</p>
                ${proposta.condicoes.observacoes ? `<p><strong>Observações:</strong> ${proposta.condicoes.observacoes}</p>` : ''}
            </div>
            
            <div style="text-align: center; padding: 20px; background: #e9ecef; border-radius: 8px;">
                <h3 style="color: #0000CB;">Valor Total: R$ ${valorTotal.toFixed(2).replace('.', ',')}</h3>
            </div>
        `;
    }
    
    const modal = document.getElementById('proposalModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function editProposal(index) {
    alert('Funcionalidade de edição será implementada em breve!');
}

function duplicateProposal(index) {
    const propostas = JSON.parse(localStorage.getItem('propostas') || '[]');
    const proposta = propostas[index];
    
    if (!proposta) return;
    
    const novaProposta = {
        ...proposta,
        id: Date.now().toString(),
        dataGeracao: new Date().toLocaleDateString(),
        status: 'enviada'
    };
    
    propostas.push(novaProposta);
    localStorage.setItem('propostas', JSON.stringify(propostas));
    
    loadProposals();
    alert('Proposta duplicada com sucesso!');
}

function deleteProposal(index) {
    if (confirm('Tem certeza que deseja excluir esta proposta?')) {
        const propostas = JSON.parse(localStorage.getItem('propostas') || '[]');
        propostas.splice(index, 1);
        localStorage.setItem('propostas', JSON.stringify(propostas));
        loadProposals();
    }
}

function closeModal() {
    const modal = document.getElementById('proposalModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ===== FUNÇÕES DE CLIENTES =====
function saveClient(event) {
    event.preventDefault();
    
    const cliente = {
        id: editingClientIndex >= 0 ? Date.now().toString() : Date.now().toString(),
        nome: document.getElementById('nomeCliente')?.value || '',
        cnpj: document.getElementById('cnpjCliente')?.value || '',
        email: document.getElementById('emailCliente')?.value || '',
        telefone: document.getElementById('telefoneCliente')?.value || '',
        endereco: document.getElementById('enderecoCliente')?.value || '',
        cidade: document.getElementById('cidadeCliente')?.value || '',
        estado: document.getElementById('estadoCliente')?.value || '',
        cep: document.getElementById('cepCliente')?.value || '',
        observacoes: document.getElementById('observacoesCliente')?.value || '',
        dataCadastro: new Date().toLocaleDateString()
    };
    
    const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
    
    if (editingClientIndex >= 0) {
        // Editando cliente existente
        clientes[editingClientIndex] = cliente;
        editingClientIndex = -1;
        alert('Cliente atualizado com sucesso!');
    } else {
        // Novo cliente
        clientes.push(cliente);
        alert('Cliente cadastrado com sucesso!');
    }
    
    localStorage.setItem('clientes', JSON.stringify(clientes));
    clearForm();
    loadClients();
}

function clearForm() {
    const form = document.getElementById('clienteForm');
    if (form) {
        form.reset();
    }
    editingClientIndex = -1;
}

function loadClients() {
    const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
    const clientsList = document.getElementById('clientsList');
    
    if (!clientsList) return;
    
    if (clientes.length === 0) {
        clientsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <h3>Nenhum cliente cadastrado</h3>
                <p>Você ainda não cadastrou nenhum cliente. Comece adicionando seu primeiro cliente!</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    clientes.forEach((cliente, index) => {
        html += `
            <div class="client-item" data-name="${cliente.nome.toLowerCase()}" data-email="${cliente.email.toLowerCase()}">
                <div class="client-header">
                    <div class="client-info">
                        <div class="client-name">${cliente.nome}</div>
                        <div class="client-details">
                            <div><strong>CNPJ/CPF:</strong> ${cliente.cnpj}</div>
                            <div><strong>E-mail:</strong> ${cliente.email}</div>
                            <div><strong>Telefone:</strong> ${cliente.telefone}</div>
                            ${cliente.endereco ? `<div><strong>Endereço:</strong> ${cliente.endereco}${cliente.cidade ? `, ${cliente.cidade}` : ''}${cliente.estado ? ` - ${cliente.estado}` : ''}</div>` : ''}
                            ${cliente.observacoes ? `<div><strong>Observações:</strong> ${cliente.observacoes}</div>` : ''}
                            <div><strong>Cadastrado em:</strong> ${cliente.dataCadastro}</div>
                        </div>
                    </div>
                    <div class="client-actions">
                        <button class="btn-action" onclick="editClient(${index})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action" onclick="createProposalForClient(${index})" title="Nova Proposta">
                            <i class="fas fa-file-plus"></i>
                        </button>
                        <button class="btn-action delete" onclick="deleteClient(${index})" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    clientsList.innerHTML = html;
}

function filterClients() {
    const searchTerm = document.getElementById('searchClients')?.value.toLowerCase() || '';
    const clientItems = document.querySelectorAll('.client-item');
    
    clientItems.forEach(item => {
        const name = item.dataset.name || '';
        const email = item.dataset.email || '';
        
        if (name.includes(searchTerm) || email.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function editClient(index) {
    const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
    const cliente = clientes[index];
    
    if (!cliente) return;
    
    // Preencher formulário
    const fields = {
        'nomeCliente': cliente.nome,
        'cnpjCliente': cliente.cnpj,
        'emailCliente': cliente.email,
        'telefoneCliente': cliente.telefone,
        'enderecoCliente': cliente.endereco || '',
        'cidadeCliente': cliente.cidade || '',
        'estadoCliente': cliente.estado || '',
        'cepCliente': cliente.cep || '',
        'observacoesCliente': cliente.observacoes || ''
    };
    
    Object.entries(fields).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.value = value;
        }
    });
    
    editingClientIndex = index;
    
    // Ir para aba de novo cliente
    showTabByName('novo-cliente');
}

function createProposalForClient(index) {
    const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
    const cliente = clientes[index];
    
    if (!cliente) return;
    
    // Salvar dados do cliente no sessionStorage para usar na página de proposta
    sessionStorage.setItem('selectedClient', JSON.stringify(cliente));
    
    // Redirecionar para página de gerar proposta
    window.location.href = 'gerar-proposta.html';
}

function deleteClient(index) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
        clientes.splice(index, 1);
        localStorage.setItem('clientes', JSON.stringify(clientes));
        loadClients();
    }
}

function showTabByName(tabName) {
    // Esconder todas as abas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remover active de todos os botões
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar aba selecionada
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Ativar botão correspondente
    const buttons = document.querySelectorAll('.tab-button');
    if (tabName === 'novo-cliente' && buttons[0]) {
        buttons[0].classList.add('active');
    } else if (tabName === 'lista-clientes' && buttons[1]) {
        buttons[1].classList.add('active');
    }
    
    // Se for a aba de lista, carregar clientes
    if (tabName === 'lista-clientes') {
        loadClients();
    }
}

// ===== FUNÇÕES DE CONFIGURAÇÕES =====
function loadConfig() {
    const config = JSON.parse(localStorage.getItem('escritorioConfig') || '{}');
    
    const fields = {
        'nomeEscritorio': config.nome || '',
        'cnpjEscritorio': config.cnpj || '',
        'emailEscritorio': config.email || '',
        'telefoneEscritorio': config.telefone || '',
        'websiteEscritorio': config.website || '',
        'crcEscritorio': config.crc || '',
        'enderecoEscritorio': config.endereco || '',
        'bairroEscritorio': config.bairro || '',
        'cidadeEscritorio': config.cidade || '',
        'estadoEscritorio': config.estado || '',
        'cepEscritorio': config.cep || '',
        'responsavelTecnico': config.responsavelTecnico || '',
        'crcResponsavel': config.crcResponsavel || '',
        'descricaoEscritorio': config.descricao || ''
    };
    
    Object.entries(fields).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.value = value;
        }
    });
    
    // Carregar logo se existir
    if (config.logo) {
        const logoPreview = document.getElementById('logoPreview');
        if (logoPreview) {
            logoPreview.innerHTML = `<img src="${config.logo}" alt="Logo">`;
        }
    }
}

function saveConfig(event) {
    event.preventDefault();
    
    const config = {
        nome: document.getElementById('nomeEscritorio')?.value || '',
        cnpj: document.getElementById('cnpjEscritorio')?.value || '',
        email: document.getElementById('emailEscritorio')?.value || '',
        telefone: document.getElementById('telefoneEscritorio')?.value || '',
        website: document.getElementById('websiteEscritorio')?.value || '',
        crc: document.getElementById('crcEscritorio')?.value || '',
        endereco: document.getElementById('enderecoEscritorio')?.value || '',
        bairro: document.getElementById('bairroEscritorio')?.value || '',
        cidade: document.getElementById('cidadeEscritorio')?.value || '',
        estado: document.getElementById('estadoEscritorio')?.value || '',
        cep: document.getElementById('cepEscritorio')?.value || '',
        responsavelTecnico: document.getElementById('responsavelTecnico')?.value || '',
        crcResponsavel: document.getElementById('crcResponsavel')?.value || '',
        descricao: document.getElementById('descricaoEscritorio')?.value || '',
        logo: localStorage.getItem('escritorioLogo') || ''
    };
    
    localStorage.setItem('escritorioConfig', JSON.stringify(config));
    showAlert('Configurações salvas com sucesso!', 'success');
}

function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Verificar tamanho (2MB)
    if (file.size > 2 * 1024 * 1024) {
        showAlert('Arquivo muito grande. Máximo 2MB.', 'error');
        return;
    }
    
    // Verificar tipo
    if (!file.type.startsWith('image/')) {
        showAlert('Formato inválido. Use JPG, PNG ou GIF.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const logoPreview = document.getElementById('logoPreview');
        if (logoPreview) {
            logoPreview.innerHTML = `<img src="${e.target.result}" alt="Logo">`;
        }
        localStorage.setItem('escritorioLogo', e.target.result);
    };
    reader.readAsDataURL(file);
}

function resetForm() {
    if (confirm('Tem certeza que deseja restaurar as configurações?')) {
        loadConfig();
        showAlert('Configurações restauradas!', 'success');
    }
}

function showAlert(message, type) {
    const alert = document.getElementById('alert');
    if (alert) {
        alert.textContent = message;
        alert.className = `alert ${type}`;
        alert.style.display = 'block';
        
        setTimeout(() => {
            alert.style.display = 'none';
        }, 3000);
    }
}

// ===== FUNÇÕES DE RESPONSIVIDADE =====
function checkScreenSize() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar && window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
    }
}

// ===== EVENTOS GLOBAIS =====
window.addEventListener('load', function() {
    // Verificar autenticação em páginas internas
    if (window.location.pathname !== '/index.html' && !window.location.pathname.endsWith('index.html')) {
        checkAuth();
    }
    
    // Inicializar sidebar
    initSidebar();
    
    // Carregar dados específicos da página
    if (document.getElementById('proposalsList')) {
        loadProposals();
    }
    
    if (document.getElementById('clientsList')) {
        loadClients();
    }
    
    if (document.getElementById('nomeEscritorio')) {
        loadConfig();
    }
    
    if (document.getElementById('stat-enviadas')) {
        loadDashboardStats();
    }
    
    // Adicionar primeiro serviço automaticamente na página de gerar proposta
    if (document.getElementById('servicos-container')) {
        addService();
    }
    
    // Verificar responsividade
    checkScreenSize();
});

window.addEventListener('resize', checkScreenSize);

// Fechar modal clicando fora
window.onclick = function(event) {
    const modal = document.getElementById('proposalModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

