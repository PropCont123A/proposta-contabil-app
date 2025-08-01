/* Sistema Proposta Contábil - JavaScript Principal Unificado */

// ===== VARIÁVEIS GLOBAIS =====
let currentTab = 0;
let serviceCounter = 0;
let editingClientIndex = -1;

// ===== FUNÇÕES DE INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
    initTabs();
    initForms();
    loadPageData();
    checkResponsive();
});

// ===== FUNÇÕES DO MENU LATERAL =====
function initSidebar() {
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
            e.preventDefault();
            
            // Remove active class de todos os itens do menu
            document.querySelectorAll('.menu-item').forEach(menuItem => {
                menuItem.classList.remove('active');
            });
            
            // Adiciona active class ao item clicado (se for menu-item)
            if (this.classList.contains('menu-item')) {
                this.classList.add('active');
            }
            
            const page = this.getAttribute('data-page') || this.getAttribute('href');
            
            if (page && page !== '#') {
                // Navegação real entre páginas
                window.location.href = page;
            }
        });
    });
}

// ===== FUNÇÕES DE ABAS =====
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            showTab(index);
        });
    });
}

function showTab(index) {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Remove active de todos os botões e conteúdos
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Ativa o botão e conteúdo correspondente
    if (tabButtons[index]) {
        tabButtons[index].classList.add('active');
    }
    if (tabContents[index]) {
        tabContents[index].classList.add('active');
    }
    
    currentTab = index;
    
    // Se for a aba de resumo, atualizar o conteúdo
    if (index === 3) {
        updateSummary();
    }
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

// ===== FUNÇÕES DE FORMULÁRIOS =====
function initForms() {
    // Adicionar primeiro serviço automaticamente se estiver na página de gerar proposta
    const servicosContainer = document.getElementById('servicos-container');
    if (servicosContainer && servicosContainer.children.length === 0) {
        addService();
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
    }).catch(() => {
        prompt('Copie o link abaixo:', link);
    });
}

function sendEmail() {
    alert('Funcionalidade de envio por e-mail será implementada em breve!');
}

// ===== FUNÇÕES DE ARMAZENAMENTO LOCAL =====
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
        return false;
    }
}

function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Erro ao carregar do localStorage:', error);
        return null;
    }
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
    const propostas = loadFromLocalStorage('propostas') || [];
    propostas.push(proposta);
    
    if (saveToLocalStorage('propostas', propostas)) {
        alert('Proposta salva com sucesso!');
        window.location.href = 'minhas-propostas.html';
    } else {
        alert('Erro ao salvar proposta. Tente novamente.');
    }
}

// ===== FUNÇÕES DE PROPOSTAS =====
function loadProposals() {
    const propostas = loadFromLocalStorage('propostas') || [];
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
    const propostas = loadFromLocalStorage('propostas') || [];
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
    const propostas = loadFromLocalStorage('propostas') || [];
    const proposta = propostas[index];
    
    if (!proposta) return;
    
    const novaProposta = {
        ...proposta,
        id: Date.now().toString(),
        dataGeracao: new Date().toLocaleDateString(),
        status: 'enviada'
    };
    
    propostas.push(novaProposta);
    
    if (saveToLocalStorage('propostas', propostas)) {
        loadProposals();
        alert('Proposta duplicada com sucesso!');
    }
}

function deleteProposal(index) {
    if (confirm('Tem certeza que deseja excluir esta proposta?')) {
        const propostas = loadFromLocalStorage('propostas') || [];
        propostas.splice(index, 1);
        
        if (saveToLocalStorage('propostas', propostas)) {
            loadProposals();
        }
    }
}

function closeModal() {
    const modal = document.getElementById('proposalModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ===== FUNÇÕES DE CLIENTES =====
function loadClients() {
    const clientes = loadFromLocalStorage('clientes') || [];
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

function saveClient(event) {
    if (event) {
        event.preventDefault();
    }
    
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
    
    const clientes = loadFromLocalStorage('clientes') || [];
    
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
    
    if (saveToLocalStorage('clientes', clientes)) {
        clearClientForm();
        loadClients();
    }
}

function clearClientForm() {
    const form = document.getElementById('clienteForm');
    if (form) {
        form.reset();
    }
    editingClientIndex = -1;
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
    const clientes = loadFromLocalStorage('clientes') || [];
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
    showTab(0);
}

function createProposalForClient(index) {
    const clientes = loadFromLocalStorage('clientes') || [];
    const cliente = clientes[index];
    
    if (!cliente) return;
    
    // Salvar dados do cliente no sessionStorage para usar na página de proposta
    sessionStorage.setItem('selectedClient', JSON.stringify(cliente));
    
    // Redirecionar para página de gerar proposta
    window.location.href = 'gerar-proposta.html';
}

function deleteClient(index) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        const clientes = loadFromLocalStorage('clientes') || [];
        clientes.splice(index, 1);
        
        if (saveToLocalStorage('clientes', clientes)) {
            loadClients();
        }
    }
}

// ===== FUNÇÕES DE CONFIGURAÇÕES =====
function loadConfig() {
    const config = loadFromLocalStorage('escritorioConfig') || {};
    
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
    if (event) {
        event.preventDefault();
    }
    
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
        logo: loadFromLocalStorage('escritorioLogo') || ''
    };
    
    if (saveToLocalStorage('escritorioConfig', config)) {
        showAlert('Configurações salvas com sucesso!', 'success');
    }
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
        saveToLocalStorage('escritorioLogo', e.target.result);
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

// ===== FUNÇÕES DE CARREGAMENTO DE DADOS =====
function loadPageData() {
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
    
    // Verificar se há cliente selecionado para proposta
    const selectedClient = sessionStorage.getItem('selectedClient');
    if (selectedClient && document.getElementById('nomeCliente')) {
        const cliente = JSON.parse(selectedClient);
        
        // Preencher dados do cliente
        document.getElementById('nomeCliente').value = cliente.nome;
        document.getElementById('cnpjCliente').value = cliente.cnpj;
        document.getElementById('emailCliente').value = cliente.email;
        document.getElementById('telefoneCliente').value = cliente.telefone;
        document.getElementById('enderecoCliente').value = cliente.endereco || '';
        document.getElementById('cidadeCliente').value = cliente.cidade || '';
        
        // Limpar sessionStorage
        sessionStorage.removeItem('selectedClient');
    }
}

function loadDashboardStats() {
    const propostas = loadFromLocalStorage('propostas') || [];
    
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

// ===== FUNÇÕES DE RESPONSIVIDADE =====
function checkResponsive() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar && window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
    }
}

// ===== EVENTOS GLOBAIS =====
window.addEventListener('resize', checkResponsive);

// Fechar modal clicando fora
window.onclick = function(event) {
    const modal = document.getElementById('proposalModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// ===== FUNÇÕES UTILITÁRIAS =====
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR');
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateCNPJ(cnpj) {
    // Implementação básica de validação de CNPJ
    cnpj = cnpj.replace(/[^\d]/g, '');
    return cnpj.length === 14;
}

function validateCPF(cpf) {
    // Implementação básica de validação de CPF
    cpf = cpf.replace(/[^\d]/g, '');
    return cpf.length === 11;
}

