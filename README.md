# Sistema Proposta Contábil - Refatorado

## 📋 Descrição

Sistema completo para gestão de propostas contábeis, refatorado com fidelidade pixel-perfect aos arquivos-mestre fornecidos. O sistema possui estrutura organizada com CSS e JavaScript centralizados para facilitar manutenção e desenvolvimento futuro.

## 🎯 Características Principais

### ✅ Fidelidade aos Arquivos-Mestre
- **Design pixel-perfect** preservado dos arquivos originais
- **Paleta de cores** exata mantida
- **Layout idêntico** aos arquivos validados
- **Funcionalidades completas** implementadas

### 🗂️ Estrutura Organizada
- **CSS centralizado** em `assets/css/main.css`
- **JavaScript unificado** em `assets/js/app.js`
- **Páginas HTML limpas** com referências externas
- **Arquivos separados** por responsabilidade

### 🎨 Design Profissional
- **Menu lateral responsivo** com navegação fluida
- **Sistema de abas** funcional
- **Formulários** com validação
- **Filtros e busca** implementados
- **Estados visuais** corretos (ativo, hover, etc.)

## 📁 Estrutura de Arquivos

```
/
├── index.html                      # Página de login
├── dashboard.html                  # Dashboard principal
├── gerar-proposta.html            # Formulário de propostas (4 abas)
├── minhas-propostas.html          # Lista de propostas com filtros
├── clientes.html                  # Cadastro de clientes (2 abas)
├── configuracoes.html             # Menu de configurações
├── configuracoes_escritorio.html  # Configurações do escritório
├── configuracoes_usuarios.html    # Gestão de usuários
├── configuracoes_servicos.html    # Gestão de serviços
├── README.md                      # Esta documentação
└── assets/
    ├── css/
    │   └── main.css              # CSS principal unificado
    └── js/
        └── app.js                # JavaScript principal unificado
```

## 🚀 Como Usar

### 1. Acesso Local
1. Extraia os arquivos do ZIP
2. Abra `index.html` no navegador
3. Use as credenciais: **admin** / **123456**
4. Navegue pelo sistema

### 2. Deploy em Servidor
1. Faça upload de todos os arquivos para seu servidor web
2. Configure o domínio para apontar para `index.html`
3. O sistema funcionará imediatamente

### 3. Hospedagem Gratuita
- **GitHub Pages**: Faça upload para repositório GitHub
- **Netlify**: Arraste a pasta para netlify.com
- **Vercel**: Conecte com repositório Git

## 📱 Páginas do Sistema

### 🔐 Login (index.html)
- Sistema de autenticação simples
- Design profissional com gradiente
- Validação de credenciais
- Redirecionamento automático

### 📊 Dashboard (dashboard.html)
- Estatísticas de propostas
- Cards com métricas importantes
- Ações rápidas para navegação
- Layout responsivo

### ➕ Gerar Proposta (gerar-proposta.html)
- **Aba 1**: Dados do Cliente
- **Aba 2**: Seleção de Serviços
- **Aba 3**: Condições de Pagamento
- **Aba 4**: Resumo da Proposta
- Navegação entre abas funcional
- Validação de formulários

### 📋 Minhas Propostas (minhas-propostas.html)
- Lista de propostas criadas
- Filtros por status, cliente e período
- Estado vazio com call-to-action
- Busca em tempo real

### 👥 Clientes (clientes.html)
- **Aba 1**: Cadastro de novo cliente
- **Aba 2**: Lista de clientes cadastrados
- Formulário completo com validação
- Busca e filtros

### ⚙️ Configurações (configuracoes.html)
- Menu principal de configurações
- Links para subpáginas
- Configurações gerais do sistema
- Informações da versão

### 🏢 Config. Escritório (configuracoes_escritorio.html)
- Dados completos do escritório
- Upload de logotipo
- Informações de contato
- Dados do responsável técnico

### 👤 Config. Usuários (configuracoes_usuarios.html)
- **Aba 1**: Gestores (acesso total)
- **Aba 2**: Usuários regulares
- Sistema de permissões
- Controle de acesso

### 🛠️ Config. Serviços (configuracoes_servicos.html)
- **Aba 1**: Cadastro de novos serviços
- **Aba 2**: Lista de serviços
- Categorização por tipo
- Controle de status

## 🎨 Paleta de Cores

```css
/* Cores Principais */
--color-primary-purple: #b733f0
--color-purple-base-dark: #8b2bb8
--color-purple-light: #d4a5f0

/* Cores de Suporte */
--color-support-blue: #007bff
--color-support-green: #10b981
--color-support-orange: #f59e0b
--color-support-red: #ef4444

/* Cores Neutras */
--color-neutral-dark: #1f2937
--color-gray-medium-dark: #4b5563
--color-gray-medium: #6b7280
--color-gray-light: #d1d5db
```

## 💻 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização com variáveis e flexbox
- **JavaScript ES6** - Interatividade e navegação
- **Font Awesome** - Ícones profissionais
- **Google Fonts** - Tipografia Poppins

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (até 767px)

## 🔧 Funcionalidades JavaScript

### Sistema de Navegação
- Navegação entre páginas
- Menu lateral retrátil
- Estados ativos dos menus

### Sistema de Abas
- Troca de conteúdo sem reload
- Estados visuais corretos
- Navegação por teclado

### Formulários
- Validação em tempo real
- Máscaras para campos
- Salvamento local (localStorage)

### Filtros e Busca
- Filtros dinâmicos
- Busca em tempo real
- Estados vazios

## 🚀 Deploy e Hospedagem

### GitHub Pages
1. Crie repositório no GitHub
2. Faça upload dos arquivos
3. Ative GitHub Pages nas configurações
4. Acesse via `username.github.io/repo-name`

### Netlify
1. Acesse netlify.com
2. Arraste a pasta do projeto
3. Sistema será publicado automaticamente
4. Domínio personalizado disponível

### Vercel
1. Conecte repositório GitHub
2. Deploy automático a cada commit
3. Domínio personalizado incluído
4. HTTPS automático

## 📞 Suporte

Para dúvidas ou suporte técnico:
- Consulte esta documentação
- Verifique os arquivos de exemplo
- Teste localmente antes do deploy

## 📝 Licença

Sistema desenvolvido para uso interno do escritório contábil. Todos os direitos reservados.

---

**Versão:** 2.0  
**Data:** Janeiro 2025  
**Status:** Pronto para produção ✅

