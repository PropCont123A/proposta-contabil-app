# Proposta Contábil - Sistema de Gestão

Sistema web para geração e gerenciamento de propostas contábeis, desenvolvido com HTML, CSS e JavaScript puro.

## 📋 Sobre o Projeto

O **Proposta Contábil** é um sistema completo para escritórios de contabilidade gerenciarem seus clientes e criarem propostas comerciais de forma profissional e eficiente.

## 🚀 Funcionalidades

### 🔐 Autenticação
- Sistema de login seguro
- Gerenciamento de usuários
- Controle de sessão

### 📊 Dashboard
- Visão geral das métricas
- Contadores de propostas e clientes
- Valor total em propostas
- Propostas recentes

### 📝 Gestão de Propostas
- Criação de propostas personalizadas
- Múltiplos serviços por proposta
- Cálculo automático de valores
- Visualização e gerenciamento

### 👥 Gestão de Clientes
- Cadastro completo de clientes
- Edição e exclusão
- Histórico de propostas

### ⚙️ Configurações
- Dados do escritório
- Configurações de usuários
- Personalização do sistema

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Armazenamento:** LocalStorage
- **Ícones:** Font Awesome 6
- **Fontes:** Google Fonts (Poppins)

## 📁 Estrutura do Projeto

```
proposta-contabil-app/
├── index.html                 # Arquivo principal
├── README.md                  # Documentação
├── src/
│   ├── assets/
│   │   ├── css/
│   │   │   └── main.css      # Estilos principais
│   │   ├── js/
│   │   │   ├── app.js        # Aplicação principal
│   │   │   ├── auth.js       # Autenticação
│   │   │   └── pages.js      # Páginas específicas
│   │   └── images/           # Imagens e ícones
│   ├── components/           # Componentes reutilizáveis
│   └── pages/               # Páginas HTML originais
├── docs/                    # Documentação adicional
└── public/                  # Arquivos públicos
```

## 🔧 Instalação e Uso

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, para desenvolvimento)

### Instalação Local
1. Clone ou baixe o repositório
2. Abra o arquivo `index.html` no navegador
3. Use as credenciais padrão: `admin` / `123456`

### Para Desenvolvimento
```bash
# Usando Python (se disponível)
python -m http.server 8000

# Usando Node.js (se disponível)
npx serve .

# Acesse: http://localhost:8000
```

## 👤 Credenciais Padrão

- **Usuário:** admin
- **Senha:** 123456

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 💻 Desktops
- 📱 Tablets
- 📱 Smartphones

## 🎨 Design

### Paleta de Cores
- **Primária:** #B733F0 (Roxo)
- **Secundária:** #9c2bd1 (Roxo escuro)
- **Sucesso:** #28a745 (Verde)
- **Erro:** #dc3545 (Vermelho)
- **Neutro:** #f8f9fa (Cinza claro)

### Tipografia
- **Fonte:** Poppins (Google Fonts)
- **Pesos:** 300, 400, 500, 600, 700

## 💾 Armazenamento de Dados

Os dados são armazenados localmente no navegador usando `localStorage`:

- **users:** Usuários do sistema
- **clients:** Clientes cadastrados
- **proposals:** Propostas criadas
- **services:** Serviços disponíveis
- **office:** Dados do escritório

## 🔒 Segurança

- Validação de formulários
- Controle de sessão
- Verificação de permissões
- Logs de auditoria

## 🌐 Deploy

### Hospedagem Estática
O sistema pode ser hospedado em qualquer servidor web estático:
- Netlify
- Vercel
- GitHub Pages
- Hostinger
- AWS S3

### Configuração de Domínio
Para usar com domínio personalizado (ex: app.propostacontabil.com.br):
1. Configure o DNS para apontar para o servidor
2. Configure SSL/HTTPS
3. Teste todas as funcionalidades

## 📚 Documentação Adicional

### Estrutura de Dados

#### Usuário
```javascript
{
  id: string,
  nome_completo: string,
  username: string,
  email: string,
  telefone: string,
  password: string,
  role: string,
  created_at: string
}
```

#### Cliente
```javascript
{
  id: string,
  nome: string,
  documento: string,
  email: string,
  telefone: string,
  endereco: string,
  created_at: string,
  user_id: string
}
```

#### Proposta
```javascript
{
  id: string,
  cliente: object,
  servicos: array,
  valor_total: number,
  observacoes: string,
  status: string,
  created_at: string,
  user_id: string
}
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas:
- Email: suporte@propostacontabil.com.br
- Website: www.propostacontabil.com.br

## 🔄 Versões

### v1.0.0 (Atual)
- Sistema básico de autenticação
- CRUD de clientes e propostas
- Dashboard com métricas
- Interface responsiva
- Armazenamento local

### Próximas Versões
- Geração de PDF
- Envio por email
- Relatórios avançados
- Integração com APIs
- Backup na nuvem

---

**Desenvolvido com ❤️ para escritórios de contabilidade**

