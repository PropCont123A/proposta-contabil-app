// Proposta Contábil - JavaScript Comum

// Estado global simplificado
const AppData = {
    currentUser: null,
    
    // Carregar dados do localStorage
    load: function() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    },
    
    // Salvar dados no localStorage
    save: function() {
        if (this.currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    },
    
    // Verificar se usuário está logado
    isLoggedIn: function() {
        return this.currentUser !== null;
    }
};

// Inicialização comum
document.addEventListener('DOMContentLoaded', function() {
    AppData.load();
    
    // Verificar autenticação
    checkAuth();
    
    // Configurar logout
    setupLogout();
    
    // Atualizar informações do usuário
    updateUserInfo();
    
    // Marcar item ativo no menu
    markActiveMenuItem();
});

// Verificar autenticação
function checkAuth() {
    const isLoginPage = window.location.pathname.includes('index.html') || 
                       window.location.pathname === '/' ||
                       window.location.pathname.endsWith('/');
    
    if (!AppData.isLoggedIn() && !isLoginPage) {
        // Redirecionar para login se não estiver logado
        window.location.href = 'index.html';
        return;
    }
    
    if (AppData.isLoggedIn() && isLoginPage) {
        // Redirecionar para dashboard se já estiver logado
        window.location.href = 'dashboard.html';
        return;
    }
}

// Configurar logout
function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

// Função de logout
function logout() {
    AppData.currentUser = null;
    localStorage.removeItem('currentUser');
    showAlert('Logout realizado com sucesso!', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Atualizar informações do usuário
function updateUserInfo() {
    if (!AppData.currentUser) return;
    
    const userNameElement = document.getElementById('user-name');
    const userAvatarElement = document.getElementById('user-avatar');
    
    if (userNameElement) {
        userNameElement.textContent = AppData.currentUser.nome_completo || 'Usuário';
    }
    
    if (userAvatarElement) {
        const name = AppData.currentUser.nome_completo || 'U';
        userAvatarElement.textContent = name.charAt(0).toUpperCase();
    }
}

// Marcar item ativo no menu
function markActiveMenuItem() {
    const currentPage = window.location.pathname.split('/').pop();
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.classList.remove('active');
        const href = item.getAttribute('href');
        if (href && href.includes(currentPage)) {
            item.classList.add('active');
        }
    });
    
    // Casos especiais
    if (currentPage === 'dashboard.html' || currentPage === '') {
        const dashboardItem = document.querySelector('[href="dashboard.html"]');
        if (dashboardItem) dashboardItem.classList.add('active');
    }
}

// Função de login (para página de login)
function login(username, password) {
    // Usuários padrão
    const defaultUsers = [
        {
            id: 1,
            nome_completo: 'Administrador',
            username: 'admin',
            email: 'admin@propostacontabil.com.br',
            password: '123456',
            role: 'admin'
        }
    ];
    
    // Verificar credenciais
    const user = defaultUsers.find(u => 
        (u.username === username || u.email === username) && u.password === password
    );
    
    if (user) {
        AppData.currentUser = user;
        AppData.save();
        showAlert('Login realizado com sucesso!', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        return true;
    } else {
        showAlert('Usuário ou senha incorretos!', 'error');
        return false;
    }
}

// Sistema de alertas
function showAlert(message, type = 'info') {
    // Remover alertas existentes
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Criar novo alerta
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${getAlertIcon(type)}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; margin-left: auto; font-size: 18px;">×</button>
    `;
    
    // Adicionar ao topo da página
    const pageContent = document.querySelector('.page-content') || document.body;
    pageContent.insertBefore(alert, pageContent.firstChild);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

// Ícones para alertas
function getAlertIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle'
    };
    return icons[type] || 'info-circle';
}

// Função para gerar ID único
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Função para formatar moeda
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Função para formatar data
function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR');
}

// Máscara para CPF/CNPJ
function maskDocument(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        // CPF
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
        // CNPJ
        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    
    input.value = value;
}

// Máscara para telefone
function maskPhone(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
    } else {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    
    input.value = value;
}

// Máscara para valor monetário
function maskMoney(input) {
    let value = input.value.replace(/\D/g, '');
    value = (value / 100).toFixed(2);
    value = value.replace('.', ',');
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    input.value = value;
}

// Exportar funções para uso global
window.AppData = AppData;
window.login = login;
window.logout = logout;
window.showAlert = showAlert;
window.generateId = generateId;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.maskDocument = maskDocument;
window.maskPhone = maskPhone;
window.maskMoney = maskMoney;

