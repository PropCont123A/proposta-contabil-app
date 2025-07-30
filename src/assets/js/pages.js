// Módulo de Páginas - Proposta Contábil

// Carregamento das páginas específicas
function loadGerarProposta() {
    const content = `
        <div class="dashboard-content fade-in">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Gerar Nova Proposta</h3>
                </div>
                <div class="card-content">
                    <form id="proposta-form" class="proposta-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Cliente</label>
                                <select id="cliente-select" class="form-control">
                                    <option value="">Selecione um cliente</option>
                                    <option value="novo">+ Novo Cliente</option>
                                    ${getClientesOptions()}
                                </select>
                            </div>
                        </div>
                        
                        <div id="novo-cliente-form" style="display: none;">
                            <h4>Dados do Novo Cliente</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Nome/Razão Social</label>
                                    <input type="text" id="cliente-nome" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">CPF/CNPJ</label>
                                    <input type="text" id="cliente-documento" class="form-control">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Email</label>
                                    <input type="email" id="cliente-email" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Telefone</label>
                                    <input type="text" id="cliente-telefone" class="form-control">
                                </div>
                            </div>
                        </div>
                        
                        <div id="servicos-container">
                            <h4>Serviços</h4>
                            <div class="servico-item">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label class="form-label">Descrição</label>
                                        <input type="text" class="form-control servico-descricao" placeholder="Ex: Contabilidade Completa">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Valor Mensal</label>
                                        <input type="number" class="form-control servico-valor" placeholder="0,00" step="0.01">
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <button type="button" onclick="addServico()" class="btn btn-secondary mb-3">+ Adicionar Serviço</button>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Observações</label>
                                <textarea id="observacoes" class="form-control" rows="3"></textarea>
                            </div>
                        </div>
                        
                        <div class="text-right">
                            <button type="submit" class="btn btn-primary">Gerar Proposta</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('page-content').innerHTML = content;
    setupGerarPropostaEvents();
}

function loadMinhasPropostas() {
    const content = `
        <div class="dashboard-content fade-in">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Minhas Propostas</h3>
                    <button onclick="navigateTo('gerar-proposta')" class="btn btn-primary">+ Nova Proposta</button>
                </div>
                <div class="card-content">
                    <div id="propostas-list">
                        ${getPropostasListHTML()}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('page-content').innerHTML = content;
}

function loadClientes() {
    const content = `
        <div class="dashboard-content fade-in">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Clientes</h3>
                    <button onclick="showClienteModal()" class="btn btn-primary">+ Novo Cliente</button>
                </div>
                <div class="card-content">
                    <div id="clientes-list">
                        ${getClientesListHTML()}
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Modal Cliente -->
        <div id="cliente-modal" class="modal" style="display: none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="cliente-modal-title">Novo Cliente</h3>
                    <button onclick="closeClienteModal()" class="modal-close">×</button>
                </div>
                <form id="cliente-form">
                    <div class="modal-body">
                        <div class="form-group">
                            <label class="form-label">Nome/Razão Social</label>
                            <input type="text" id="modal-cliente-nome" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">CPF/CNPJ</label>
                            <input type="text" id="modal-cliente-documento" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" id="modal-cliente-email" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Telefone</label>
                            <input type="text" id="modal-cliente-telefone" class="form-control">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary">Salvar</button>
                        <button type="button" onclick="closeClienteModal()" class="btn btn-secondary">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.getElementById('page-content').innerHTML = content;
    setupClientesEvents();
}

function loadConfiguracoes() {
    const content = `
        <div class="dashboard-content fade-in">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Configurações do Escritório</h3>
                </div>
                <div class="card-content">
                    <form id="escritorio-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Nome do Escritório</label>
                                <input type="text" id="escritorio-nome" class="form-control" value="${AppState.data.office.nome || ''}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">CNPJ</label>
                                <input type="text" id="escritorio-cnpj" class="form-control" value="${AppState.data.office.cnpj || ''}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Endereço</label>
                            <input type="text" id="escritorio-endereco" class="form-control" value="${AppState.data.office.endereco || ''}">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Telefone</label>
                                <input type="text" id="escritorio-telefone" class="form-control" value="${AppState.data.office.telefone || ''}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Email</label>
                                <input type="email" id="escritorio-email" class="form-control" value="${AppState.data.office.email || ''}">
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary">Salvar Configurações</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('page-content').innerHTML = content;
    setupConfiguracoesEvents();
}

// Funções auxiliares para HTML
function getClientesOptions() {
    return AppState.data.clients.map(client => 
        `<option value="${client.id}">${client.nome}</option>`
    ).join('');
}

function getPropostasListHTML() {
    if (AppState.data.proposals.length === 0) {
        return '<p class="text-center">Nenhuma proposta criada ainda</p>';
    }
    
    return AppState.data.proposals.map(proposal => `
        <div class="proposal-item mb-3 p-3" style="border: 1px solid #ddd; border-radius: 5px;">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h5>${proposal.cliente?.nome || 'Cliente não informado'}</h5>
                    <p class="mb-1">Valor: ${formatCurrency(proposal.valor_total)}</p>
                    <small class="text-muted">Criada em: ${formatDate(proposal.created_at)}</small>
                </div>
                <div>
                    <button onclick="viewProposta('${proposal.id}')" class="btn btn-primary btn-sm">Ver</button>
                    <button onclick="deleteProposta('${proposal.id}')" class="btn btn-danger btn-sm">Excluir</button>
                </div>
            </div>
        </div>
    `).join('');
}

function getClientesListHTML() {
    if (AppState.data.clients.length === 0) {
        return '<p class="text-center">Nenhum cliente cadastrado ainda</p>';
    }
    
    return AppState.data.clients.map(client => `
        <div class="client-item mb-3 p-3" style="border: 1px solid #ddd; border-radius: 5px;">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h5>${client.nome}</h5>
                    <p class="mb-1">Documento: ${client.documento}</p>
                    <p class="mb-1">Email: ${client.email}</p>
                    <small class="text-muted">Telefone: ${client.telefone || 'Não informado'}</small>
                </div>
                <div>
                    <button onclick="editCliente('${client.id}')" class="btn btn-primary btn-sm">Editar</button>
                    <button onclick="deleteCliente('${client.id}')" class="btn btn-danger btn-sm">Excluir</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Event Listeners específicos
function setupGerarPropostaEvents() {
    const clienteSelect = document.getElementById('cliente-select');
    const novoClienteForm = document.getElementById('novo-cliente-form');
    const propostaForm = document.getElementById('proposta-form');
    
    if (clienteSelect) {
        clienteSelect.addEventListener('change', function() {
            if (this.value === 'novo') {
                novoClienteForm.style.display = 'block';
            } else {
                novoClienteForm.style.display = 'none';
            }
        });
    }
    
    if (propostaForm) {
        propostaForm.addEventListener('submit', handlePropostaSubmit);
    }
}

function setupClientesEvents() {
    const clienteForm = document.getElementById('cliente-form');
    if (clienteForm) {
        clienteForm.addEventListener('submit', handleClienteSubmit);
    }
}

function setupConfiguracoesEvents() {
    const escritorioForm = document.getElementById('escritorio-form');
    if (escritorioForm) {
        escritorioForm.addEventListener('submit', handleEscritorioSubmit);
    }
}

// Handlers de formulários
function handlePropostaSubmit(e) {
    e.preventDefault();
    
    const clienteSelect = document.getElementById('cliente-select');
    let cliente;
    
    if (clienteSelect.value === 'novo') {
        // Criar novo cliente
        cliente = {
            id: generateId(),
            nome: document.getElementById('cliente-nome').value,
            documento: document.getElementById('cliente-documento').value,
            email: document.getElementById('cliente-email').value,
            telefone: document.getElementById('cliente-telefone').value,
            created_at: new Date().toISOString()
        };
        
        AppState.data.clients.push(cliente);
        saveDataToStorage('clients', AppState.data.clients);
    } else {
        cliente = AppState.data.clients.find(c => c.id === clienteSelect.value);
    }
    
    if (!cliente) {
        showAlert('Por favor, selecione um cliente', 'error');
        return;
    }
    
    // Coletar serviços
    const servicosElements = document.querySelectorAll('.servico-item');
    const servicos = Array.from(servicosElements).map(item => {
        return {
            descricao: item.querySelector('.servico-descricao').value,
            valor: parseFloat(item.querySelector('.servico-valor').value) || 0
        };
    });
    
    if (servicos.length === 0 || !servicos[0].descricao) {
        showAlert('Por favor, adicione pelo menos um serviço', 'error');
        return;
    }
    
    const valorTotal = servicos.reduce((total, servico) => total + servico.valor, 0);
    
    const proposta = {
        id: generateId(),
        cliente: cliente,
        servicos: servicos,
        valor_total: valorTotal,
        observacoes: document.getElementById('observacoes').value,
        status: 'pendente',
        created_at: new Date().toISOString(),
        user_id: AppState.currentUser.id
    };
    
    AppState.data.proposals.push(proposta);
    saveDataToStorage('proposals', AppState.data.proposals);
    
    showAlert('Proposta criada com sucesso!', 'success');
    navigateTo('minhas-propostas');
}

function handleClienteSubmit(e) {
    e.preventDefault();
    
    const clienteData = {
        nome: document.getElementById('modal-cliente-nome').value,
        documento: document.getElementById('modal-cliente-documento').value,
        email: document.getElementById('modal-cliente-email').value,
        telefone: document.getElementById('modal-cliente-telefone').value
    };
    
    if (window.currentEditingCliente) {
        // Editar cliente existente
        const index = AppState.data.clients.findIndex(c => c.id === window.currentEditingCliente.id);
        if (index !== -1) {
            AppState.data.clients[index] = { ...AppState.data.clients[index], ...clienteData };
            saveDataToStorage('clients', AppState.data.clients);
        }
    } else {
        // Criar novo cliente
        const novoCliente = {
            id: generateId(),
            ...clienteData,
            created_at: new Date().toISOString(),
            user_id: AppState.currentUser.id
        };
        AppState.data.clients.push(novoCliente);
        saveDataToStorage('clients', AppState.data.clients);
    }
    
    closeClienteModal();
    loadClientes();
    showAlert('Cliente salvo com sucesso!', 'success');
}

function handleEscritorioSubmit(e) {
    e.preventDefault();
    
    const escritorioData = {
        nome: document.getElementById('escritorio-nome').value,
        cnpj: document.getElementById('escritorio-cnpj').value,
        endereco: document.getElementById('escritorio-endereco').value,
        telefone: document.getElementById('escritorio-telefone').value,
        email: document.getElementById('escritorio-email').value
    };
    
    AppState.data.office = { ...AppState.data.office, ...escritorioData };
    saveDataToStorage('office', AppState.data.office);
    
    showAlert('Configurações salvas com sucesso!', 'success');
}

// Funções de ação
function addServico() {
    const container = document.getElementById('servicos-container');
    const servicoHtml = `
        <div class="servico-item">
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Descrição</label>
                    <input type="text" class="form-control servico-descricao" placeholder="Ex: Contabilidade Completa">
                </div>
                <div class="form-group">
                    <label class="form-label">Valor Mensal</label>
                    <input type="number" class="form-control servico-valor" placeholder="0,00" step="0.01">
                </div>
            </div>
            <button type="button" onclick="removeServico(this)" class="btn btn-danger btn-sm">Remover</button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', servicoHtml);
}

function removeServico(button) {
    const servicosContainer = document.getElementById('servicos-container');
    if (servicosContainer.querySelectorAll('.servico-item').length > 1) {
        button.closest('.servico-item').remove();
    }
}

function showClienteModal() {
    window.currentEditingCliente = null;
    document.getElementById('cliente-modal-title').textContent = 'Novo Cliente';
    document.getElementById('cliente-form').reset();
    document.getElementById('cliente-modal').style.display = 'flex';
}

function editCliente(clienteId) {
    const cliente = AppState.data.clients.find(c => c.id === clienteId);
    if (cliente) {
        window.currentEditingCliente = cliente;
        document.getElementById('cliente-modal-title').textContent = 'Editar Cliente';
        
        document.getElementById('modal-cliente-nome').value = cliente.nome;
        document.getElementById('modal-cliente-documento').value = cliente.documento;
        document.getElementById('modal-cliente-email').value = cliente.email;
        document.getElementById('modal-cliente-telefone').value = cliente.telefone || '';
        
        document.getElementById('cliente-modal').style.display = 'flex';
    }
}

function closeClienteModal() {
    document.getElementById('cliente-modal').style.display = 'none';
    window.currentEditingCliente = null;
}

function deleteCliente(clienteId) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        AppState.data.clients = AppState.data.clients.filter(c => c.id !== clienteId);
        saveDataToStorage('clients', AppState.data.clients);
        loadClientes();
        showAlert('Cliente excluído com sucesso!', 'success');
    }
}

function viewProposta(propostaId) {
    const proposta = AppState.data.proposals.find(p => p.id === propostaId);
    if (proposta) {
        // Implementar visualização da proposta
        showAlert('Funcionalidade de visualização em desenvolvimento', 'info');
    }
}

function deleteProposta(propostaId) {
    if (confirm('Tem certeza que deseja excluir esta proposta?')) {
        AppState.data.proposals = AppState.data.proposals.filter(p => p.id !== propostaId);
        saveDataToStorage('proposals', AppState.data.proposals);
        loadMinhasPropostas();
        showAlert('Proposta excluída com sucesso!', 'success');
    }
}

// Exportar funções globais
window.loadGerarProposta = loadGerarProposta;
window.loadMinhasPropostas = loadMinhasPropostas;
window.loadClientes = loadClientes;
window.loadConfiguracoes = loadConfiguracoes;
window.addServico = addServico;
window.removeServico = removeServico;
window.showClienteModal = showClienteModal;
window.editCliente = editCliente;
window.closeClienteModal = closeClienteModal;
window.deleteCliente = deleteCliente;
window.viewProposta = viewProposta;
window.deleteProposta = deleteProposta;



// Funções auxiliares para dashboard
function getMonthlyProposals() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return AppState.data.proposals.filter(proposal => {
        const proposalDate = new Date(proposal.created_at);
        return proposalDate.getMonth() === currentMonth && proposalDate.getFullYear() === currentYear;
    }).length;
}

function getMonthlyRevenue() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTotal = AppState.data.proposals
        .filter(proposal => {
            const proposalDate = new Date(proposal.created_at);
            return proposalDate.getMonth() === currentMonth && proposalDate.getFullYear() === currentYear;
        })
        .reduce((total, proposal) => total + (proposal.valor_total || 0), 0);
    
    return monthlyTotal.toFixed(2);
}

function getConversionRate() {
    const totalProposals = AppState.data.proposals.length;
    const approvedProposals = AppState.data.proposals.filter(p => p.status === 'aprovada').length;
    
    if (totalProposals === 0) return 0;
    return Math.round((approvedProposals / totalProposals) * 100);
}

// Atualizar função loadDashboard
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
                        <div class="quick-actions">
                            <button onclick="navigateTo('gerar-proposta')" class="btn btn-primary w-100 mb-2">
                                <i class="fas fa-plus"></i> Nova Proposta
                            </button>
                            <button onclick="navigateTo('clientes')" class="btn btn-secondary w-100 mb-2">
                                <i class="fas fa-user-plus"></i> Novo Cliente
                            </button>
                            <button onclick="navigateTo('configuracoes')" class="btn btn-secondary w-100">
                                <i class="fas fa-cog"></i> Configurações
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="dashboard-charts">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Estatísticas do Mês</h3>
                    </div>
                    <div class="card-content">
                        <div class="chart-placeholder">
                            <div class="chart-info">
                                <div class="chart-metric">
                                    <span class="metric-value">${getMonthlyProposals()}</span>
                                    <span class="metric-label">Propostas este mês</span>
                                </div>
                                <div class="chart-metric">
                                    <span class="metric-value">R$ ${getMonthlyRevenue()}</span>
                                    <span class="metric-label">Receita estimada</span>
                                </div>
                                <div class="chart-metric">
                                    <span class="metric-value">${getConversionRate()}%</span>
                                    <span class="metric-label">Taxa de conversão</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('page-content').innerHTML = content;
}

// Exportar novas funções
window.getMonthlyProposals = getMonthlyProposals;
window.getMonthlyRevenue = getMonthlyRevenue;
window.getConversionRate = getConversionRate;

