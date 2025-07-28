// Módulo de Autenticação - Proposta Contábil

// Funções de autenticação
function validateLogin(username, password) {
    if (!username || !password) {
        showLoginAlert('Por favor, preencha todos os campos.', 'error');
        return false;
    }
    
    if (username.length < 3) {
        showLoginAlert('Usuário deve ter pelo menos 3 caracteres.', 'error');
        return false;
    }
    
    if (password.length < 6) {
        showLoginAlert('Senha deve ter pelo menos 6 caracteres.', 'error');
        return false;
    }
    
    return true;
}

function showLoginAlert(message, type = 'error') {
    const alertContainer = document.getElementById('login-alert');
    if (!alertContainer) return;
    
    const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
    
    alertContainer.innerHTML = `
        <div class="alert ${alertClass}">
            ${message}
        </div>
    `;
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 5000);
}

// Gerenciamento de sessão
function createSession(user) {
    const sessionData = {
        user: user,
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
    };
    
    localStorage.setItem('userSession', JSON.stringify(sessionData));
    return sessionData;
}

function getSession() {
    const sessionData = localStorage.getItem('userSession');
    if (!sessionData) return null;
    
    try {
        const session = JSON.parse(sessionData);
        const now = new Date();
        const expiresAt = new Date(session.expiresAt);
        
        if (now > expiresAt) {
            clearSession();
            return null;
        }
        
        return session;
    } catch (error) {
        clearSession();
        return null;
    }
}

function clearSession() {
    localStorage.removeItem('userSession');
    localStorage.removeItem('currentUser');
}

function isAuthenticated() {
    const session = getSession();
    return session && session.user;
}

// Proteção de rotas
function requireAuth() {
    if (!isAuthenticated()) {
        logout();
        return false;
    }
    return true;
}

// Funções de usuário
function createUser(userData) {
    const users = AppState.data.users || [];
    
    // Verificar se usuário já existe
    const existingUser = users.find(u => 
        u.username === userData.username || u.email === userData.email
    );
    
    if (existingUser) {
        throw new Error('Usuário ou email já existe');
    }
    
    const newUser = {
        id: generateId(),
        nome_completo: userData.nome_completo,
        username: userData.username,
        email: userData.email,
        telefone: userData.telefone || '',
        password: userData.password,
        role: userData.role || 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    
    users.push(newUser);
    saveDataToStorage('users', users);
    
    return newUser;
}

function updateUser(userId, userData) {
    const users = AppState.data.users || [];
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        throw new Error('Usuário não encontrado');
    }
    
    // Verificar se email/username não conflita com outros usuários
    const conflictUser = users.find(u => 
        u.id !== userId && (u.username === userData.username || u.email === userData.email)
    );
    
    if (conflictUser) {
        throw new Error('Usuário ou email já existe');
    }
    
    users[userIndex] = {
        ...users[userIndex],
        ...userData,
        updated_at: new Date().toISOString()
    };
    
    saveDataToStorage('users', users);
    
    // Atualizar sessão se for o usuário atual
    if (AppState.currentUser && AppState.currentUser.id === userId) {
        AppState.currentUser = users[userIndex];
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
    }
    
    return users[userIndex];
}

function deleteUser(userId) {
    if (AppState.currentUser && AppState.currentUser.id === userId) {
        throw new Error('Não é possível excluir o usuário logado');
    }
    
    const users = AppState.data.users || [];
    const filteredUsers = users.filter(u => u.id !== userId);
    
    if (filteredUsers.length === users.length) {
        throw new Error('Usuário não encontrado');
    }
    
    saveDataToStorage('users', filteredUsers);
    return true;
}

function changePassword(userId, currentPassword, newPassword) {
    const users = AppState.data.users || [];
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        throw new Error('Usuário não encontrado');
    }
    
    if (user.password !== currentPassword) {
        throw new Error('Senha atual incorreta');
    }
    
    if (newPassword.length < 6) {
        throw new Error('Nova senha deve ter pelo menos 6 caracteres');
    }
    
    user.password = newPassword;
    user.updated_at = new Date().toISOString();
    
    saveDataToStorage('users', users);
    
    // Atualizar sessão se for o usuário atual
    if (AppState.currentUser && AppState.currentUser.id === userId) {
        AppState.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
    }
    
    return true;
}

// Verificação de permissões
function hasPermission(permission) {
    if (!AppState.currentUser) return false;
    
    const userRole = AppState.currentUser.role || 'user';
    
    const permissions = {
        admin: ['create_user', 'edit_user', 'delete_user', 'manage_office', 'view_all_data'],
        manager: ['create_proposal', 'edit_proposal', 'view_reports'],
        user: ['create_proposal', 'edit_own_proposal', 'view_own_data']
    };
    
    const userPermissions = permissions[userRole] || [];
    return userPermissions.includes(permission);
}

function canEditUser(targetUserId) {
    if (!AppState.currentUser) return false;
    
    // Admin pode editar qualquer usuário
    if (AppState.currentUser.role === 'admin') return true;
    
    // Usuário pode editar apenas a si mesmo
    return AppState.currentUser.id === targetUserId;
}

function canDeleteUser(targetUserId) {
    if (!AppState.currentUser) return false;
    
    // Não pode deletar a si mesmo
    if (AppState.currentUser.id === targetUserId) return false;
    
    // Apenas admin pode deletar usuários
    return AppState.currentUser.role === 'admin';
}

// Logs de auditoria
function logUserAction(action, details = {}) {
    if (!AppState.currentUser) return;
    
    const logEntry = {
        id: generateId(),
        userId: AppState.currentUser.id,
        username: AppState.currentUser.username,
        action: action,
        details: details,
        timestamp: new Date().toISOString(),
        ip: 'localhost', // Em produção, capturar IP real
        userAgent: navigator.userAgent
    };
    
    const logs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
    logs.push(logEntry);
    
    // Manter apenas os últimos 1000 logs
    if (logs.length > 1000) {
        logs.splice(0, logs.length - 1000);
    }
    
    localStorage.setItem('auditLogs', JSON.stringify(logs));
}

function getAuditLogs(limit = 100) {
    const logs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
    return logs.slice(-limit).reverse();
}

// Exportar funções
window.validateLogin = validateLogin;
window.showLoginAlert = showLoginAlert;
window.createSession = createSession;
window.getSession = getSession;
window.clearSession = clearSession;
window.isAuthenticated = isAuthenticated;
window.requireAuth = requireAuth;
window.createUser = createUser;
window.updateUser = updateUser;
window.deleteUser = deleteUser;
window.changePassword = changePassword;
window.hasPermission = hasPermission;
window.canEditUser = canEditUser;
window.canDeleteUser = canDeleteUser;
window.logUserAction = logUserAction;
window.getAuditLogs = getAuditLogs;

