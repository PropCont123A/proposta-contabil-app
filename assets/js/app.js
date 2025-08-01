// Proposta Contábil - JavaScript Principal

// Toggle do menu lateral
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleBtn");

if (toggleBtn) {
    toggleBtn.addEventListener("click", function() {
        sidebar.classList.toggle("collapsed");
    });
}

// Navegação do menu
const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach(item => {
    item.addEventListener("click", function(e) {
        e.preventDefault();
        
        document.querySelectorAll(".menu-item").forEach(menuItem => {
            menuItem.classList.remove("active");
        });
        
        this.classList.add("active");
        
        const page = this.getAttribute("data-page");
        console.log("Navegando para:", page);

        // Redireciona para a página correspondente
        if (page === "configuracoes") {
            window.location.href = "configuracoes.html";
        } else if (page === "gerar-proposta") {
            window.location.href = "gerar-proposta.html";
        } else if (page === "cadastro-clientes") {
            window.location.href = "clientes.html";
        } else if (page === "minhas-propostas") {
            window.location.href = "minhas-propostas.html";
        } else if (page === "dashboard") {
            window.location.href = "dashboard.html";
        }
    });
});

// Responsividade
function checkScreenSize() {
    if (window.innerWidth <= 768) {
        if (sidebar) {
            sidebar.classList.add("collapsed");
        }
    }
}

window.addEventListener("resize", checkScreenSize);
checkScreenSize(); // Verificar no carregamento inicial

// Lógica das abas (para páginas de configuração)
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(button => {
    button.addEventListener("click", () => {
        tabButtons.forEach(btn => btn.classList.remove("active"));
        tabContents.forEach(content => content.classList.remove("active"));

        button.classList.add("active");
        const targetTab = document.getElementById(button.dataset.tab);
        if (targetTab) {
            targetTab.classList.add("active");
        }
    });
});

// Ativar a primeira aba por padrão
document.addEventListener("DOMContentLoaded", () => {
    if (tabButtons.length > 0) {
        tabButtons[0].click();
    }
});

// Lógica para upload de logotipo
const logoUpload = document.getElementById("logoUpload");
if (logoUpload) {
    logoUpload.addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            alert("Logotipo selecionado: " + file.name);
            // Aqui você pode adicionar a lógica para pré-visualizar a imagem ou fazer o upload real
        }
    });
}

// Lógica para adicionar/remover campos dinâmicos
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("add-btn")) {
        const parentGroup = e.target.closest(".form-group");
        const template = parentGroup.querySelector(".dynamic-field-template");
        if (template) {
            const clone = template.content.cloneNode(true);
            parentGroup.insertBefore(clone, e.target.parentNode); // Insere antes do botão de adicionar
        }
    }

    if (e.target.classList.contains("remove-btn")) {
        e.target.closest(".dynamic-field-group").remove();
    }
});

// Lógica para salvar configurações
const saveBtn = document.getElementById("saveBtn");
if (saveBtn) {
    saveBtn.addEventListener("click", () => {
        alert("Configurações salvas!");
        // Aqui você pode coletar os dados do formulário e enviá-los para o backend
    });
}

// Lógica para resetar formulário
const resetBtn = document.getElementById("resetBtn");
if (resetBtn) {
    resetBtn.addEventListener("click", () => {
        if (confirm("Tem certeza que deseja resetar o formulário? Todas as alterações não salvas serão perdidas.")) {
            const form = document.querySelector("form");
            if (form) {
                form.reset();
            }
            alert("Formulário resetado.");
        }
    });
}

// Lógica do Modal (para cadastro de usuários)
const userModal = document.getElementById("userModal");
const userForm = document.getElementById("userForm");
const modalTitle = document.getElementById("modal-title");
const userIdInput = document.getElementById("user-id");
const userNameInput = document.getElementById("user-name");
const userEmailInput = document.getElementById("user-email");
const userTypeInput = document.getElementById("user-type");
const usersTableBody = document.getElementById("users-table-body");

let users = []; // Array para armazenar os usuários

function openAddUserModal() {
    if (modalTitle) modalTitle.textContent = "Adicionar Usuário";
    if (userForm) userForm.reset();
    if (userIdInput) userIdInput.value = "";
    if (userModal) userModal.style.display = "flex";
}

function closeUserModal() {
    if (userModal) userModal.style.display = "none";
}

function saveUser(event) {
    event.preventDefault();
    const id = userIdInput ? userIdInput.value : "";
    const name = userNameInput ? userNameInput.value : "";
    const email = userEmailInput ? userEmailInput.value : "";
    const type = userTypeInput ? userTypeInput.value : "";

    if (id) {
        // Editar usuário existente
        const userIndex = users.findIndex(user => user.id === id);
        if (userIndex > -1) {
            users[userIndex] = { id, name, email, type };
        }
    } else {
        // Adicionar novo usuário
        const newUser = { id: Date.now().toString(), name, email, type };
        users.push(newUser);
    }
    renderUsersTable();
    closeUserModal();
}

function editUser(id) {
    const user = users.find(user => user.id === id);
    if (user) {
        if (modalTitle) modalTitle.textContent = "Editar Usuário";
        if (userIdInput) userIdInput.value = user.id;
        if (userNameInput) userNameInput.value = user.name;
        if (userEmailInput) userEmailInput.value = user.email;
        if (userTypeInput) userTypeInput.value = user.type;
        if (userModal) userModal.style.display = "flex";
    }
}

function deleteUser(id) {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
        users = users.filter(user => user.id !== id);
        renderUsersTable();
    }
}

function renderUsersTable() {
    if (!usersTableBody) return;
    
    usersTableBody.innerHTML = "";
    users.forEach(user => {
        const row = usersTableBody.insertRow();
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.type === "gestor" ? "Gestor" : "Usuário Regular"}</td>
            <td>
                <button type="button" class="btn btn-edit" style="padding: 6px 12px; font-size: 12px; margin-right: 5px;" onclick="editUser('${user.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="btn btn-danger" style="padding: 6px 12px; font-size: 12px;" onclick="deleteUser('${user.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
    });
}

if (userForm) {
    userForm.addEventListener("submit", saveUser);
}

// Adicionar alguns usuários de exemplo ao carregar (apenas se estiver na página de usuários)
document.addEventListener("DOMContentLoaded", () => {
    if (usersTableBody) {
        users.push({ id: "1", name: "João Silva", email: "joao.silva@example.com", type: "gestor" });
        users.push({ id: "2", name: "Maria Souza", email: "maria.souza@example.com", type: "regular" });
        renderUsersTable();
    }
});

// Função para acordeões (template_link_web_final.html)
function toggleAccordion(button) {
    const content = button.nextElementSibling;
    button.classList.toggle("active");
    content.classList.toggle("active");
}

// Lógica para formulário de geração de proposta
const gerarPropostaForm = document.getElementById("gerarPropostaForm");
if (gerarPropostaForm) {
    gerarPropostaForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        // Coletar dados do formulário
        const formData = new FormData(this);
        const dados = {};
        
        for (let [key, value] of formData.entries()) {
            dados[key] = value;
        }
        
        console.log("Dados da proposta:", dados);
        
        // Simular geração da proposta
        alert("Proposta gerada com sucesso!");
        
        // Aqui você pode redirecionar para a página de visualização da proposta
        // window.location.href = "template-link-web.html";
    });
}

// Lógica para tabela de propostas
function editarProposta(id) {
    console.log("Editando proposta:", id);
    // Implementar lógica de edição
}

function excluirProposta(id) {
    if (confirm("Tem certeza que deseja excluir esta proposta?")) {
        console.log("Excluindo proposta:", id);
        // Implementar lógica de exclusão
    }
}

function visualizarProposta(id) {
    console.log("Visualizando proposta:", id);
    // Implementar lógica de visualização
}

function gerarLink(id) {
    console.log("Gerando link para proposta:", id);
    // Implementar lógica de geração de link
    alert("Link gerado com sucesso!");
}

function compartilharWhatsApp(id) {
    console.log("Compartilhando no WhatsApp proposta:", id);
    // Implementar lógica de compartilhamento
}

function enviarEmail(id) {
    console.log("Enviando por email proposta:", id);
    // Implementar lógica de envio por email
}

// Lógica para cadastro de clientes
const cadastroClienteForm = document.getElementById("cadastroClienteForm");
if (cadastroClienteForm) {
    cadastroClienteForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        // Coletar dados do formulário
        const formData = new FormData(this);
        const dados = {};
        
        for (let [key, value] of formData.entries()) {
            dados[key] = value;
        }
        
        console.log("Dados do cliente:", dados);
        
        // Simular cadastro do cliente
        alert("Cliente cadastrado com sucesso!");
        
        // Limpar formulário
        this.reset();
    });
}

// Máscaras para campos de entrada
function aplicarMascaras() {
    // Máscara para telefone
    const telefoneInputs = document.querySelectorAll('input[type="tel"]');
    telefoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            }
            e.target.value = value;
        });
    });
    
    // Máscara para CPF/CNPJ
    const documentoInputs = document.querySelectorAll('input[data-mask="documento"]');
    documentoInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                // CPF
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            } else {
                // CNPJ
                value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
            }
            e.target.value = value;
        });
    });
}

// Aplicar máscaras quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", aplicarMascaras);

// Função para validar formulários
function validarFormulario(form) {
    const campos = form.querySelectorAll('input[required], select[required], textarea[required]');
    let valido = true;
    
    campos.forEach(campo => {
        if (!campo.value.trim()) {
            campo.style.borderColor = '#dc3545';
            valido = false;
        } else {
            campo.style.borderColor = '';
        }
    });
    
    return valido;
}

// Função para mostrar notificações
function mostrarNotificacao(mensagem, tipo = 'info') {
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    notificacao.textContent = mensagem;
    
    notificacao.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    switch(tipo) {
        case 'success':
            notificacao.style.backgroundColor = '#28a745';
            break;
        case 'error':
            notificacao.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            notificacao.style.backgroundColor = '#ffc107';
            notificacao.style.color = '#000';
            break;
        default:
            notificacao.style.backgroundColor = '#17a2b8';
    }
    
    document.body.appendChild(notificacao);
    
    setTimeout(() => {
        notificacao.remove();
    }, 3000);
}

// Adicionar estilos para animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

