// ===== SISTEMA DE NAVEGAÇÃO E MENU LATERAL =====

// Toggle do menu lateral
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleBtn');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }
}

// Navegação entre páginas
function initNavigation() {
    const menuItems = document.querySelectorAll('.menu-item, .action-btn');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Se o item tem href válido, deixa seguir o link
            const href = this.getAttribute('href');
            if (href && href !== '#' && !href.startsWith('javascript:')) {
                return; // Deixa o navegador seguir o link
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
            
            if (page) {
                // Redireciona para a página correspondente
                const pageMap = {
                    'dashboard': 'dashboard.html',
                    'gerar-proposta': 'gerar-proposta.html',
                    'minhas-propostas': 'minhas-propostas.html',
                    'cadastro-clientes': 'clientes.html',
                    'clientes': 'clientes.html',
                    'configuracoes': 'configuracoes.html'
                };
                
                if (pageMap[page]) {
                    window.location.href = pageMap[page];
                }
            }
        });
    });
}

// ===== SISTEMA DE ABAS =====

let currentTab = 0;

function showTab(tabIndex) {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Remove active de todos os botões e conteúdos
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Adiciona active ao botão e conteúdo selecionado
    if (tabButtons[tabIndex]) {
        tabButtons[tabIndex].classList.add('active');
    }
    if (tabContents[tabIndex]) {
        tabContents[tabIndex].classList.add('active');
    }
    
    currentTab = tabIndex;
}

function nextTab() {
    const tabContents = document.querySelectorAll('.tab-content');
    if (currentTab < tabContents.length - 1) {
        showTab(currentTab + 1);
    }
}

function prevTab() {
    if (currentTab > 0) {
        showTab(currentTab - 1);
    }
}

// ===== FORMULÁRIO DE GERAR PROPOSTA =====

function addService() {
    const container = document.getElementById('servicos-container');
    if (!container) return;
    
    const serviceDiv = document.createElement('div');
    serviceDiv.className = 'service-item';
    serviceDiv.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Tipo de Serviço</label>
                <input type="text" class="form-control" placeholder="Ex: Contabilidade Mensal">
            </div>
            <div class="form-group">
                <label>Valor</label>
                <input type="text" class="form-control" placeholder="R$ 0,00">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Descrição</label>
                <textarea class="form-control" rows="3" placeholder="Descrição do serviço..."></textarea>
            </div>
        </div>
        <button type="button" class="btn-secondary" onclick="removeService(this)" style="margin-bottom: 20px;">
            <i class="fas fa-trash"></i> Remover Serviço
        </button>
    `;
    container.appendChild(serviceDiv);
}

function removeService(button) {
    button.parentElement.remove();
}

function generatePDF() {
    alert('Funcionalidade de geração de PDF será implementada em breve!');
}

function generateLink() {
    alert('Funcionalidade de geração de link será implementada em breve!');
}

function sendEmail() {
    alert('Funcionalidade de envio por e-mail será implementada em breve!');
}

function saveProposta() {
    alert('Proposta salva com sucesso!');
}

// ===== SISTEMA DE RESUMO =====

function toggleSummary() {
    const summaryContent = document.getElementById('summary-content');
    if (summaryContent) {
        summaryContent.classList.toggle('active');
    }
}

// ===== FILTROS E BUSCA =====

function filterProposals() {
    const statusFilter = document.getElementById('filterStatus')?.value || '';
    const clientFilter = document.getElementById('filterClient')?.value.toLowerCase() || '';
    const periodFilter = document.getElementById('filterPeriod')?.value || '';
    
    // Implementar lógica de filtro quando houver dados
    console.log('Filtros aplicados:', { statusFilter, clientFilter, periodFilter });
}

function filterClients() {
    const searchTerm = document.getElementById('searchClients')?.value.toLowerCase() || '';
    
    // Implementar lógica de filtro quando houver dados
    console.log('Busca de clientes:', searchTerm);
}

// ===== GERENCIAMENTO DE CLIENTES =====

function saveClient(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const clientData = Object.fromEntries(formData);
    
    // Salvar no localStorage (simulação)
    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    clientData.id = Date.now().toString();
    clientData.createdAt = new Date().toISOString();
    clients.push(clientData);
    localStorage.setItem('clients', JSON.stringify(clients));
    
    alert('Cliente salvo com sucesso!');
    event.target.reset();
    loadClients();
}

function clearClientForm() {
    const form = document.getElementById('clienteForm');
    if (form) {
        form.reset();
    }
}

function loadClients() {
    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    const clientsList = document.getElementById('clientsList');
    
    if (!clientsList) return;
    
    if (clients.length === 0) {
        clientsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <h3>Nenhum cliente cadastrado</h3>
                <p>Adicione clientes para começar a criar propostas.</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    clients.forEach((client, index) => {
        html += `
            <div class="client-item">
                <div class="client-header">
                    <div class="client-info">
                        <div class="client-name">${client.nomeCliente}</div>
                        <div class="client-details">
                            <div><strong>CNPJ/CPF:</strong> ${client.cnpjCliente}</div>
                            <div><strong>E-mail:</strong> ${client.emailCliente}</div>
                            <div><strong>Telefone:</strong> ${client.telefoneCliente}</div>
                            <div><strong>Cidade:</strong> ${client.cidadeCliente || 'Não informado'}</div>
                        </div>
                    </div>
                    <div class="client-actions">
                        <button class="btn-action" onclick="editClient(${index})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action" onclick="deleteClient(${index})" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    clientsList.innerHTML = html;
}

function editClient(index) {
    alert('Funcionalidade de edição será implementada em breve!');
}

function deleteClient(index) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        const clients = JSON.parse(localStorage.getItem('clients') || '[]');
        clients.splice(index, 1);
        localStorage.setItem('clients', JSON.stringify(clients));
        loadClients();
    }
}

// ===== GERENCIAMENTO DE PROPOSTAS =====

function loadProposals() {
    const proposals = JSON.parse(localStorage.getItem('proposals') || '[]');
    const proposalsList = document.getElementById('proposalsList');
    
    if (!proposalsList) return;
    
    if (proposals.length === 0) {
        proposalsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <h3>Nenhuma proposta encontrada</h3>
                <p>Você ainda não criou nenhuma proposta. Comece criando sua primeira proposta!</p>
                <a href="gerar-proposta.html" class="action-btn" style="margin-top: 20px; display: inline-flex;">
                    <i class="fas fa-plus"></i>
                    Criar Primeira Proposta
                </a>
            </div>
        `;
        return;
    }
    
    // Implementar listagem de propostas quando houver dados
    console.log('Propostas carregadas:', proposals);
}

// ===== MODAL =====

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal(modalId) {
    const modal = modalId ? document.getElementById(modalId) : document.querySelector('.modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Fechar modal clicando fora
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});

// ===== CONFIGURAÇÕES =====

function saveConfig(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const configData = Object.fromEntries(formData);
    
    // Salvar configurações no localStorage
    localStorage.setItem('escritorioConfig', JSON.stringify(configData));
    
    alert('Configurações salvas com sucesso!');
}

function loadConfig() {
    const config = JSON.parse(localStorage.getItem('escritorioConfig') || '{}');
    
    // Preencher formulário com dados salvos
    Object.keys(config).forEach(key => {
        const field = document.getElementById(key);
        if (field) {
            field.value = config[key];
        }
    });
}

function resetForm() {
    if (confirm('Tem certeza que deseja restaurar as configurações?')) {
        const form = document.querySelector('form');
        if (form) {
            form.reset();
        }
    }
}

function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const logoPreview = document.getElementById('logoPreview');
            if (logoPreview) {
                logoPreview.innerHTML = `<img src="${e.target.result}" alt="Logo" style="max-width: 100%; max-height: 100%; object-fit: contain;">`;
            }
        };
        reader.readAsDataURL(file);
    }
}

// ===== INICIALIZAÇÃO =====

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes básicos
    initSidebar();
    initNavigation();
    
    // Inicializar primeira aba se existir
    const firstTab = document.querySelector('.tab-button');
    if (firstTab) {
        showTab(0);
    }
    
    // Carregar dados se estiver na página correspondente
    if (window.location.pathname.includes('clientes.html')) {
        loadClients();
    }
    
    if (window.location.pathname.includes('minhas-propostas.html')) {
        loadProposals();
    }
    
    if (window.location.pathname.includes('configuracoes_escritorio.html')) {
        loadConfig();
    }
    
    // Marcar item ativo do menu baseado na página atual
    const currentPage = window.location.pathname.split('/').pop();
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPage) {
            item.classList.add('active');
        }
    });
});

// ===== UTILITÁRIOS =====

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateCNPJ(cnpj) {
    // Implementar validação de CNPJ
    return cnpj.length >= 14;
}

function validateCPF(cpf) {
    // Implementar validação de CPF
    return cpf.length >= 11;
}

