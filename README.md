# Sistema Proposta Contábil - Versão Organizada

## 📋 Descrição

Sistema completo para geração e gestão de propostas contábeis com arquitetura organizada e separação de responsabilidades.

## 🎯 Características

### ✅ **Design Original Preservado**
- Paleta de cores exata dos arquivos validados
- Layout idêntico ao aprovado pelo usuário
- CSS Variables organizadas profissionalmente
- Responsividade mantida

### 🗂️ **Estrutura Organizada**
- **CSS separado** em `assets/css/main.css`
- **JavaScript separado** em `assets/js/app.js`
- **HTML limpo** com referências externas
- **Manutenção facilitada**

### 🔗 **Navegação Simples**
- Páginas HTML separadas (mais confiável)
- Links diretos entre páginas funcionando
- Menu lateral replicado em todas as páginas
- Sem JavaScript complexo de SPA

## 📁 Estrutura de Arquivos

```
proposta-contabil-organizado/
├── assets/
│   ├── css/
│   │   └── main.css          # Todos os estilos CSS
│   └── js/
│       └── app.js            # Todas as funcionalidades JS
├── index.html                # Página de login
├── dashboard.html            # Dashboard principal
├── gerar-proposta.html       # Formulário de propostas
├── minhas-propostas.html     # Lista de propostas
├── clientes.html             # Cadastro de clientes
├── configuracoes.html        # Configurações do escritório
└── README.md                 # Esta documentação
```

## 🚀 Como Usar

### **1. Instalação Local**
1. Baixe e extraia os arquivos
2. Abra `index.html` no navegador
3. Use as credenciais: `admin` / `123456`

### **2. Deploy Online**
- **GitHub Pages**: Faça upload para repositório GitHub
- **Vercel**: Conecte o repositório ao Vercel
- **Netlify**: Arraste a pasta para o Netlify

## 📱 Funcionalidades

### ✅ **Sistema de Login**
- Login com usuário/senha
- Cadastro de novos usuários
- Autenticação persistente

### ✅ **Dashboard**
- Estatísticas em tempo real
- Ações rápidas
- Navegação intuitiva

### ✅ **Gerar Propostas**
- Formulário em abas
- Dados do cliente
- Serviços personalizáveis
- Condições comerciais
- Resumo completo

### ✅ **Minhas Propostas**
- Lista completa de propostas
- Filtros por status, cliente e período
- Visualização detalhada
- Ações (editar, duplicar, excluir)

### ✅ **Cadastro de Clientes**
- Formulário completo
- Lista de clientes
- Busca e filtros
- Integração com propostas

### ✅ **Configurações**
- Dados do escritório
- Upload de logo
- Responsável técnico
- Personalização completa

## 🎨 Paleta de Cores

### **Cores Principais**
- **Azul Primário**: `#0000CB`
- **Roxo Primário**: `#B733F0`
- **Rosa Primário**: `#FD7BF6`

### **Cores Neutras**
- **Escuro**: `#1A1A1A`
- **Médio**: `#A0A0A0`
- **Claro**: `#E5E5E5`
- **Extra Claro**: `#FAFAFA`

## 💾 Armazenamento

O sistema utiliza **localStorage** para persistir dados:
- `isLoggedIn`: Status de autenticação
- `currentUser`: Usuário atual
- `users`: Lista de usuários cadastrados
- `propostas`: Propostas criadas
- `clientes`: Clientes cadastrados
- `escritorioConfig`: Configurações do escritório

## 🔧 Tecnologias

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com CSS Variables
- **JavaScript ES6+**: Funcionalidades interativas
- **Font Awesome**: Ícones profissionais
- **Google Fonts**: Tipografia Poppins

## 📱 Responsividade

- **Desktop**: Layout completo
- **Tablet**: Menu lateral adaptado
- **Mobile**: Interface otimizada

## 🔒 Credenciais Padrão

- **Usuário**: `admin`
- **Senha**: `123456`

## 🎯 Próximas Melhorias

1. **Geração de PDF** das propostas
2. **Envio por e-mail** automático
3. **Integração com APIs** de pagamento
4. **Relatórios avançados**
5. **Backup automático** dos dados

## 📞 Suporte

Sistema desenvolvido com base nos arquivos originais validados, mantendo 100% do design aprovado e adicionando estrutura organizada para facilitar manutenção futura.

---

**Versão**: 2.0 Organizada  
**Data**: Janeiro 2025  
**Status**: ✅ Pronto para produção

