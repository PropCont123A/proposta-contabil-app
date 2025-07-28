// Proposta Contábil - JavaScript Principal

// Estado global da aplicação
const AppState = {
    currentUser: null,
    currentPage: 'dashboard',
    sidebarCollapsed: false,
    data: {
        users: [],
        clients: [],
        proposals: [],
        services: [],
        office: {}
    }
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadDataFromStorage();
    initializeDefaultData();
    checkAuthentication();
    setupEventListeners();
    loadCurrentPage();
}

// Gerenciamento de dados
function loadDataFromStorage() {
    const keys = ['users', 'clients', 'proposals', 'services', 'office'];
    keys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
            AppState.data[key] = JSON.parse(data);
        }
    });
    
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        AppState.currentUser = JSON.parse(currentUser);
    }
}

function saveDataToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    AppState.data[key] = data;
}

function initializeDefaultData() {
    // Criar usuário admin padrão se não existir
    if (AppState.data.users.length === 0) {
        const adminUser = {
            id: generateId(),
            nome_completo: 'Administrador',
            username: 'admin',
            email: 'admin@propostacontabil.com.br',
            telefone: '',
            password: '123456',
            role: 'admin',
            created_at: new Date().toISOString()
        };
        AppState.data.users.push(adminUser);
        saveDataToStorage('users', AppState.data.users);
    }
    
    // Inicializar dados do escritório se não existirem
    if (!AppState.data.office.nome) {
        AppState.data.office = {
            nome: 'Meu Escritório Contábil',
            cnpj: '',
            endereco: '',
            telefone: '',
            email: '',
            logo: ''
        };
        saveDataToStorage('office', AppState.data.office);
    }
}

// Autenticação
function checkAuthentication() {
    const loginScreen = document.getElementById('login-screen');
    const mainApp = document.getElementById('main-app');
    
    if (AppState.currentUser) {
        if (loginScreen) loginScreen.style.display = 'none';
        if (mainApp) mainApp.style.display = 'block';
        updateUserInfo();
    } else {
        if (loginScreen) loginScreen.style.display = 'block';
        if (mainApp) mainApp.style.display = 'none';
    }
}

function login(username, password) {
    const user = AppState.data.users.find(u => 
        (u.username === username || u.email === username) && u.password === password
    );
    
    if (user) {
        AppState.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        checkAuthentication();
        showAlert('Login realizado com sucesso!', 'success');
        return true;
    } else {
        showAlert('Usuário ou senha incorretos!', 'error');
        return false;
    }
}

function logout() {
    AppState.currentUser = null;
    localStorage.removeItem('currentUser');
    checkAuthentication();
    showAlert('Logout realizado com sucesso!', 'success');
}

function updateUserInfo() {
    const userNameElement = document.getElementById('user-name');
    const userAvatarElement = document.getElementById('user-avatar');
    
    if (userNameElement && AppState.currentUser) {
        userNameElement.textContent = AppState.currentUser.nome_completo;
    }
    
    if (userAvatarElement && AppState.currentUser) {
        userAvatarElement.textContent = AppState.currentUser.nome_completo.charAt(0).toUpperCase();
    }
}

// Navegação
function navigateTo(page) {
    AppState.currentPage = page;
    
    // Atualizar menu ativo
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeMenuItem = document.querySelector(`[data-page="${page}"]`);
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
    }
    
    // Carregar conteúdo da página
    loadPageContent(page);
    
    // Atualizar título da página
    updatePageTitle(page);
}

function loadPageContent(page) {
    const contentArea = document.getElementById('page-content');
    if (!contentArea) return;
    
    switch(page) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'gerar-proposta':
            loadGerarProposta();
            break;
        case 'minhas-propostas':
            loadMinhasPropostas();
            break;
        case 'clientes':
            loadClientes();
            break;
        case 'configuracoes':
            loadConfiguracoes();
            break;
        default:
            loadDashboard();
    }
}

function updatePageTitle(page) {
    const titles = {
        'dashboard': 'Dashboard',
        'gerar-proposta': 'Gerar Proposta',
        'minhas-propostas': 'Minhas Propostas',
        'clientes': 'Clientes',
        'configuracoes': 'Configurações'
    };
    
    const titleElement = document.getElementById('page-title');
    if (titleElement) {
        titleElement.textContent = titles[page] || 'Dashboard';
    }
}

// Carregamento de páginas
function loadDashboard() {
    const content = `
        <div class="dashboard-content fade-in">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon proposals">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="total-proposals">${AppState.data.proposals.length}</h3>
                        <p>Total de Propostas</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon clients">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="total-clients">${AppState.data.clients.length}</h3>
                        <p>Clientes Cadastrados</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon revenue">
                        <i class="fas fa-dollar-sign"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="total-revenue">R$ ${calculateTotalRevenue()}</h3>
                        <p>Valor Total em Propostas</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon pending">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="pending-proposals">${getPendingProposals()}</h3>
                        <p>Propostas Pendentes</p>
                    </div>
                </div>
            </div>
            
            <div class="content-grid">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Propostas Recentes</h3>
                        <a href="#" onclick="navigateTo('minhas-propostas')" class="btn btn-primary btn-sm">Ver Todas</a>
                    </div>
                    <div class="card-content">
                        <div id="recent-proposals">
                            ${getRecentProposalsHTML()}
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Ações Rápidas</h3>
                    </div>
                    <div class="card-content">
                        <div class="d-flex flex-column gap-2">
                            <button onclick="navigateTo('gerar-proposta')" class="btn btn-primary">
                                <i class="fas fa-plus"></i> Nova Proposta
                            </button>
                            <button onclick="navigateTo('clientes')" class="btn btn-secondary">
                                <i class="fas fa-user-plus"></i> Novo Cliente
                            </button>
                            <button onclick="navigateTo('configuracoes')" class="btn btn-secondary">
                                <i class="fas fa-cog"></i> Configurações
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('page-content').innerHTML = content;
}

// Funções auxiliares
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value || 0);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

function calculateTotalRevenue() {
    return AppState.data.proposals.reduce((total, proposal) => {
        return total + (proposal.valor_total || 0);
    }, 0).toFixed(2);
}

function getPendingProposals() {
    return AppState.data.proposals.filter(p => p.status === 'pendente').length;
}

function getRecentProposalsHTML() {
    const recent = AppState.data.proposals.slice(-5).reverse();
    
    if (recent.length === 0) {
        return '<p class="text-center">Nenhuma proposta criada ainda</p>';
    }
    
    return recent.map(proposal => `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <div>
                <strong>${proposal.cliente?.nome || 'Cliente não informado'}</strong>
                <br>
                <small class="text-muted">${formatDate(proposal.created_at)}</small>
            </div>
            <div class="text-right">
                <strong>${formatCurrency(proposal.valor_total)}</strong>
                <br>
                <span class="badge badge-${proposal.status === 'aprovada' ? 'success' : proposal.status === 'rejeitada' ? 'danger' : 'warning'}">
                    ${proposal.status || 'Pendente'}
                </span>
            </div>
        </div>
    `).join('');
}

// Event Listeners
function setupEventListeners() {
    // Toggle sidebar
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleSidebar);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Menu items
    document.querySelectorAll('.menu-item[data-page]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateTo(page);
        });
    });
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
        AppState.sidebarCollapsed = sidebar.classList.contains('collapsed');
    }
}

// Alertas e notificações
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container') || createAlertContainer();
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} fade-in`;
    alert.innerHTML = `
        <span>${message}</span>
        <button type="button" class="alert-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    alertContainer.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

function createAlertContainer() {
    const container = document.createElement('div');
    container.id = 'alert-container';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        max-width: 400px;
    `;
    document.body.appendChild(container);
    return container;
}

// Carregar página atual
function loadCurrentPage() {
    const hash = window.location.hash.substring(1);
    const page = hash || 'dashboard';
    navigateTo(page);
}

// Atualizar hash da URL
window.addEventListener('hashchange', loadCurrentPage);

// Exportar funções globais
window.AppState = AppState;
window.navigateTo = navigateTo;
window.login = login;
window.logout = logout;
window.showAlert = showAlert;

