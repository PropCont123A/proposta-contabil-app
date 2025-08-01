# Sistema Proposta Contábil - Versão Final

## 📋 Sobre o Sistema

Sistema completo para geração de propostas contábeis desenvolvido com **100% de fidelidade** aos arquivos-mestre fornecidos. O sistema mantém o design original validado e implementa navegação funcional entre páginas separadas.

## 🎯 Características Principais

### ✅ Design Original Preservado
- **Paleta de cores** exata dos arquivos-mestre
- **Layout pixel-perfect** mantido
- **Tipografia** e espaçamentos originais
- **Responsividade** preservada

### ✅ Estrutura Organizada
- **CSS separado** em `assets/css/main.css`
- **JavaScript separado** em `assets/js/app.js`
- **Páginas HTML limpas** com referências externas
- **Estrutura profissional** para manutenção

### ✅ Funcionalidades Completas
- **Sistema de login** com validação
- **Dashboard** com estatísticas
- **Geração de propostas** em abas
- **Gestão de clientes** completa
- **Configurações** do sistema
- **Navegação fluida** entre páginas

## 📁 Estrutura de Arquivos

```
proposta-contabil-final/
├── index.html                      # Página de login
├── dashboard.html                  # Dashboard principal
├── gerar-proposta.html            # Formulário de propostas
├── minhas-propostas.html          # Lista de propostas
├── clientes.html                  # Cadastro de clientes
├── configuracoes.html             # Menu de configurações
├── configuracoes_escritorio.html  # Config do escritório
├── configuracoes_usuarios.html    # Gestão de usuários
├── configuracoes_servicos.html    # Gestão de serviços
├── assets/
│   ├── css/
│   │   └── main.css              # Estilos unificados
│   └── js/
│       └── app.js                # JavaScript unificado
└── README.md                     # Esta documentação
```

## 🚀 Como Usar

### 1. Acesso Local
1. Extraia os arquivos do ZIP
2. Abra `index.html` no navegador
3. Use as credenciais: **admin** / **123456**

### 2. Deploy em Servidor
1. Faça upload de todos os arquivos para seu servidor
2. Configure o domínio para apontar para `index.html`
3. O sistema funcionará imediatamente

### 3. GitHub Pages / Netlify / Vercel
1. Crie um repositório no GitHub
2. Faça upload dos arquivos
3. Ative o GitHub Pages ou conecte com Netlify/Vercel
4. O sistema será publicado automaticamente

## 🔐 Credenciais de Acesso

**Usuário:** admin  
**Senha:** 123456

## 📱 Páginas do Sistema

### 1. **Login (index.html)**
- Sistema de autenticação
- Validação de credenciais
- Redirecionamento automático

### 2. **Dashboard (dashboard.html)**
- Estatísticas de propostas
- Ações rápidas
- Visão geral do sistema

### 3. **Gerar Proposta (gerar-proposta.html)**
- Formulário em 4 abas:
  - Dados do Cliente
  - Serviços
  - Condições de Pagamento
  - Resumo da Proposta
- Validação de campos
- Geração de PDF/Link

### 4. **Minhas Propostas (minhas-propostas.html)**
- Lista de propostas criadas
- Filtros por status, cliente e período
- Ações de visualização e edição

### 5. **Clientes (clientes.html)**
- Cadastro de novos clientes
- Lista de clientes existentes
- Busca e filtros

### 6. **Configurações (configuracoes.html)**
- Menu principal de configurações
- Links para subpáginas
- Configurações gerais do sistema

### 7. **Config Escritório (configuracoes_escritorio.html)**
- Dados do escritório
- Upload de logo
- Informações de contato
- Responsável técnico

### 8. **Config Usuários (configuracoes_usuarios.html)**
- Cadastro de usuários
- Gestão de permissões
- Controle de acesso

### 9. **Config Serviços (configuracoes_servicos.html)**
- Cadastro de serviços
- Categorização
- Gestão de preços

## 🎨 Paleta de Cores

```css
/* Cores Principais */
--color-primary-blue: #0000CB
--color-primary-purple: #B733F0
--color-primary-pink: #FD7BF6

/* Cores Neutras */
--color-neutral-dark: #1A1A1A
--color-neutral-medium: #A0A0A0
--color-neutral-light: #E5E5E5
--color-neutral-extra-light: #FAFAFA
```

## 🔧 Funcionalidades Técnicas

### ✅ Armazenamento Local
- Dados salvos no `localStorage`
- Persistência entre sessões
- Backup automático

### ✅ Validação de Formulários
- Campos obrigatórios marcados
- Validação em tempo real
- Mensagens de erro claras

### ✅ Navegação
- Menu lateral responsivo
- Links funcionais entre páginas
- Estados ativos indicados

### ✅ Responsividade
- Design adaptável
- Suporte mobile e desktop
- Breakpoints otimizados

## 📞 Suporte

Este sistema foi desenvolvido com base nos arquivos-mestre fornecidos, mantendo **100% de fidelidade** ao design original aprovado.

Para customizações ou melhorias, todos os arquivos estão organizados e documentados para facilitar a manutenção.

---

**Versão:** 2.0  
**Data:** Janeiro 2025  
**Status:** Pronto para produção ✅

