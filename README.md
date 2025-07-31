# Proposta Contábil - Sistema Completo

## 📋 Descrição

Sistema completo para geração e gestão de propostas contábeis, desenvolvido com HTML, CSS e JavaScript puro. Funciona 100% offline no navegador, sem necessidade de servidor.

## 🚀 Funcionalidades

### ✅ Sistema de Autenticação
- Login e logout funcional
- Usuário padrão: `admin` / `123456`
- Dados salvos no localStorage

### 📊 Dashboard
- Visão geral do sistema
- Estatísticas de propostas e clientes
- Ações rápidas
- Cards informativos

### 📝 Gerar Propostas
- Formulário completo para criação de propostas
- Seleção ou cadastro de novos clientes
- Múltiplos serviços por proposta
- Cálculo automático de valores
- Condições personalizáveis

### 📋 Gerenciar Propostas
- Lista de todas as propostas criadas
- Busca e filtros
- Ações de visualizar, editar e excluir
- Estatísticas por status

### 👥 Gerenciar Clientes
- Cadastro completo de clientes
- Dados gerais, endereço e contatos
- Seções recolhíveis/expansíveis
- Busca e edição
- Integração com geração de propostas

### ⚙️ Configurações
- Dados do escritório
- Personalização visual (cores e logo)
- Templates de proposta
- Backup e restauração de dados
- Limpeza de dados

## 🎨 Design

### Paleta de Cores
- **Azul Primário:** #0000CB
- **Roxo Primário:** #B733F0
- **Neutros:** Escala de cinzas profissional
- **Status:** Verde, laranja, vermelho para diferentes estados

### Características Visuais
- Design moderno e profissional
- Responsivo (desktop, tablet, mobile)
- Sidebar fixa com navegação
- Cards e componentes bem estruturados
- Animações suaves
- Ícones Font Awesome

## 📁 Estrutura de Arquivos

```
proposta-contabil-separado/
├── index.html              # Página de login
├── dashboard.html           # Dashboard principal
├── gerar-proposta.html      # Formulário de propostas
├── minhas-propostas.html    # Lista de propostas
├── clientes.html           # Gestão de clientes
├── configuracoes.html      # Configurações do sistema
├── assets/
│   ├── css/
│   │   └── main.css        # Estilos principais
│   ├── js/
│   │   └── common.js       # JavaScript comum
│   └── images/             # Imagens (vazio)
└── pages/                  # Diretório auxiliar (vazio)
```

## 🔧 Como Usar

### Instalação Local
1. Baixe e extraia o arquivo ZIP
2. Abra o arquivo `index.html` no navegador
3. Use as credenciais: `admin` / `123456`
4. Navegue pelo sistema usando o menu lateral

### Upload para GitHub
1. Crie um repositório no GitHub
2. Faça upload de todos os arquivos
3. Configure GitHub Pages (opcional)
4. Acesse via URL do GitHub Pages

### Deploy no Vercel
1. Conecte o repositório GitHub ao Vercel
2. Configure o domínio `app.propostacontabil.com.br`
3. Deploy automático a cada commit

## 💾 Armazenamento de Dados

O sistema utiliza `localStorage` do navegador para persistir dados:

- **Usuários:** Autenticação e sessão
- **Clientes:** Cadastro completo
- **Propostas:** Dados das propostas criadas
- **Configurações:** Dados do escritório e personalização

### Estrutura dos Dados

```javascript
// Clientes
{
  id: "unique_id",
  nome: "Nome do Cliente",
  documento: "CPF/CNPJ",
  email: "email@cliente.com",
  telefone: "(00) 00000-0000",
  endereco: { /* dados completos */ },
  contatos: [ /* contatos adicionais */ ],
  dataCadastro: "2024-01-01T00:00:00.000Z"
}

// Configurações
{
  escritorio: { /* dados do escritório */ },
  visual: { /* cores e logo */ },
  templates: { /* textos padrão */ }
}
```

## 🔒 Segurança

- Dados armazenados localmente no navegador
- Não há transmissão de dados para servidores externos
- Sistema funciona completamente offline
- Backup manual dos dados disponível

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- **Desktop:** Layout completo com sidebar
- **Tablet:** Layout adaptado
- **Mobile:** Menu colapsível, layout vertical

## 🎯 Próximos Passos

### Melhorias Futuras
1. **Geração de PDF:** Converter propostas para PDF
2. **Envio por Email:** Integração com serviços de email
3. **Templates Avançados:** Mais opções de personalização
4. **Relatórios:** Dashboards com gráficos
5. **Multi-usuário:** Sistema com múltiplos usuários
6. **Banco de Dados:** Migração para banco real

### Integrações Possíveis
- **Supabase:** Banco de dados na nuvem
- **EmailJS:** Envio de emails
- **jsPDF:** Geração de PDFs
- **Chart.js:** Gráficos e relatórios

## 🐛 Solução de Problemas

### Dados Não Salvam
- Verifique se o navegador permite localStorage
- Teste em modo privado/incógnito
- Limpe o cache do navegador

### Layout Quebrado
- Verifique se todos os arquivos CSS estão carregando
- Teste em navegadores diferentes
- Verifique console do navegador para erros

### Funcionalidades Não Funcionam
- Verifique se JavaScript está habilitado
- Abra console do navegador (F12) para ver erros
- Teste em navegador atualizado

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação acima
2. Teste em navegador diferente
3. Verifique console do navegador para erros
4. Entre em contato com o desenvolvedor

## 📄 Licença

Sistema desenvolvido para uso comercial. Todos os direitos reservados.

---

**Versão:** 1.0.0  
**Data:** Janeiro 2024  
**Desenvolvido por:** Manus AI  
**Tecnologias:** HTML5, CSS3, JavaScript ES6, Font Awesome

