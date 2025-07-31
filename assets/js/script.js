// Toggle do menu lateral
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleBtn');

if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
    });
}

// Navegação entre páginas
const menuItems = document.querySelectorAll('.menu-item, .action-btn');

menuItems.forEach(item => {
    item.addEventListener('click', function(e) {
        // Se o item tem um href válido (não é #), permite a navegação normal
        const href = this.getAttribute('href');
        if (href && href !== '#') {
            return; // Permite navegação normal
        }
        
        e.preventDefault();
        
        // Remove active class de todos os itens do menu
        document.querySelectorAll('.menu-item').forEach(menuItem => {
            menuItem.classList.remove('active');
        });
        
        // Adiciona active class ao item clicado (se for menu-item)
        if (this.classList.contains('menu-item')) {
            this.classList.add('active');
        }
        
        const page = this.getAttribute('data-page');
        
        // Aqui você pode implementar a navegação entre páginas
        console.log('Navegando para:', page);
        
        // Exemplo de mudança de título
        const header = document.querySelector('.header h1');
        if (header) {
            switch(page) {
                case 'dashboard':
                    header.textContent = 'Dashboard';
                    break;
                case 'gerar-proposta':
                    header.textContent = 'Gerar Nova Proposta';
                    break;
                case 'minhas-propostas':
                    header.textContent = 'Minhas Propostas';
                    break;
                case 'cadastro-clientes':
                    header.textContent = 'Cadastro de Clientes';
                    break;
                case 'configuracoes':
                    header.textContent = 'Configurações';
                    break;
            }
        }
    });
});

// Responsividade - colapsar menu em telas pequenas
function checkScreenSize() {
    if (window.innerWidth <= 768 && sidebar) {
        sidebar.classList.add('collapsed');
    }
}

window.addEventListener('resize', checkScreenSize);
checkScreenSize(); // Verificar no carregamento inicial

// Funcionalidade para abas
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetId = this.getAttribute('data-tab');
            
            // Remove active class de todas as abas
            tabs.forEach(t => t.classList.remove('active'));
            
            // Remove active class de todos os painéis
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Adiciona active class na aba clicada
            this.classList.add('active');
            
            // Mostra o painel correspondente
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // Ativa a primeira aba por padrão se nenhuma estiver ativa
    if (tabs.length > 0 && !document.querySelector('.tab.active')) {
        tabs[0].click();
    }
});

// Funcionalidade para formulários
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Formulário submetido:', this);
            // Aqui você pode adicionar a lógica de envio do formulário
        });
    });
});

// Funcionalidade para validação de campos
function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    
    if (isRequired && !value) {
        field.style.borderColor = '#ef4444';
        return false;
    } else {
        field.style.borderColor = '#e1e5e9';
        return true;
    }
}

// Adiciona validação em tempo real aos campos de formulário
document.addEventListener('DOMContentLoaded', function() {
    const formFields = document.querySelectorAll('input, select, textarea');
    
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
    });
});

// Funcionalidade para mostrar/ocultar senhas
document.addEventListener('DOMContentLoaded', function() {
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
});

// Funcionalidade para notificações
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos inline para a notificação
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    // Cores baseadas no tipo
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#10b981';
            break;
        case 'error':
            notification.style.backgroundColor = '#ef4444';
            break;
        case 'warning':
            notification.style.backgroundColor = '#f59e0b';
            break;
        case 'info':
            notification.style.backgroundColor = '#3b82f6';
            break;
    }
    
    document.body.appendChild(notification);
    
    // Anima a entrada
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove após 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Funcionalidade para confirmar ações
function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// Funcionalidade para formatação de campos
function formatCurrency(input) {
    let value = input.value.replace(/\D/g, '');
    value = (value / 100).toFixed(2);
    value = value.replace('.', ',');
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    input.value = 'R$ ' + value;
}

function formatPhone(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    input.value = value;
}

function formatCPF(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    input.value = value;
}

function formatCNPJ(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    input.value = value;
}

// Aplicar formatação automática aos campos
document.addEventListener('DOMContentLoaded', function() {
    const currencyFields = document.querySelectorAll('[data-format="currency"]');
    const phoneFields = document.querySelectorAll('[data-format="phone"]');
    const cpfFields = document.querySelectorAll('[data-format="cpf"]');
    const cnpjFields = document.querySelectorAll('[data-format="cnpj"]');
    
    currencyFields.forEach(field => {
        field.addEventListener('input', () => formatCurrency(field));
    });
    
    phoneFields.forEach(field => {
        field.addEventListener('input', () => formatPhone(field));
    });
    
    cpfFields.forEach(field => {
        field.addEventListener('input', () => formatCPF(field));
    });
    
    cnpjFields.forEach(field => {
        field.addEventListener('input', () => formatCNPJ(field));
    });
});

