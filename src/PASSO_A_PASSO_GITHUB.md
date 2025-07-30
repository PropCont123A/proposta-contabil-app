# 📚 PASSO A PASSO - UPLOAD PARA GITHUB

Guia completo para fazer upload do sistema Proposta Contábil para o GitHub e configurar deploy no Vercel.

## 🎯 OBJETIVO

Subir o código do sistema para o GitHub e configurar deploy automático no Vercel para que fique acessível em `app.propostacontabil.com.br`.

## 📋 PRÉ-REQUISITOS

✅ Conta no GitHub criada  
✅ Conta no Vercel criada  
✅ Conta no Supabase criada  
✅ Domínio `propostacontabil.com.br` na Hostinger  

## 🚀 PASSO 1 - CRIAR REPOSITÓRIO NO GITHUB

### 1.1 Acessar GitHub
1. Acesse: https://github.com
2. Faça login com sua conta

### 1.2 Criar Novo Repositório
1. Clique no botão **"New"** (verde) ou no **"+"** no canto superior direito
2. Selecione **"New repository"**

### 1.3 Configurar Repositório
**Nome do repositório:** `proposta-contabil-app`  
**Descrição:** `Sistema de Gestão de Propostas Contábeis`  
**Visibilidade:** ✅ Public (recomendado para deploy gratuito)  
**Inicializar com:**
- ❌ Add a README file (já temos um)
- ❌ Add .gitignore (não necessário)
- ❌ Choose a license (opcional)

### 1.4 Criar Repositório
1. Clique em **"Create repository"**
2. **IMPORTANTE:** Anote a URL do repositório (ex: `https://github.com/seuusuario/proposta-contabil-app`)

## 📁 PASSO 2 - PREPARAR ARQUIVOS PARA UPLOAD

### 2.1 Baixar Arquivos
1. Baixe o arquivo ZIP que foi criado com todos os arquivos organizados
2. Extraia o ZIP em uma pasta no seu computador
3. Você deve ter a seguinte estrutura:

```
proposta-contabil-app/
├── index.html
├── README.md
├── PASSO_A_PASSO_GITHUB.md
├── src/
│   ├── assets/
│   │   ├── css/
│   │   │   └── main.css
│   │   └── js/
│   │       ├── app.js
│   │       ├── auth.js
│   │       └── pages.js
│   └── pages/
│       ├── cadastro_clientes.html
│       ├── main_dashboard.html
│       └── (outros arquivos...)
```

## 🔄 PASSO 3 - FAZER UPLOAD PARA GITHUB

### Método 1: Upload via Interface Web (Mais Fácil)

#### 3.1 Acessar Repositório
1. Acesse seu repositório no GitHub
2. Você verá uma tela com instruções de setup

#### 3.2 Upload de Arquivos
1. Clique em **"uploading an existing file"**
2. Arraste TODOS os arquivos da pasta `proposta-contabil-app` para a área de upload
3. **IMPORTANTE:** Mantenha a estrutura de pastas

#### 3.3 Fazer Commit
1. Na parte inferior da página:
   - **Commit message:** `Primeira versão do sistema Proposta Contábil`
   - **Description:** `Sistema completo com autenticação, CRUD de clientes e propostas`
2. Clique em **"Commit changes"**

### Método 2: Via Git (Para Usuários Avançados)

```bash
# 1. Navegar para a pasta do projeto
cd caminho/para/proposta-contabil-app

# 2. Inicializar Git
git init

# 3. Adicionar arquivos
git add .

# 4. Fazer primeiro commit
git commit -m "Primeira versão do sistema Proposta Contábil"

# 5. Adicionar repositório remoto
git remote add origin https://github.com/seuusuario/proposta-contabil-app.git

# 6. Fazer push
git push -u origin main
```

## 🌐 PASSO 4 - CONFIGURAR DEPLOY NO VERCEL

### 4.1 Acessar Vercel
1. Acesse: https://vercel.com
2. Faça login com sua conta

### 4.2 Importar Projeto
1. Clique em **"New Project"**
2. Clique em **"Import Git Repository"**
3. Conecte sua conta do GitHub se ainda não conectou
4. Selecione o repositório `proposta-contabil-app`

### 4.3 Configurar Deploy
**Project Name:** `proposta-contabil-app`  
**Framework Preset:** `Other`  
**Root Directory:** `./` (raiz)  
**Build Command:** (deixe vazio)  
**Output Directory:** (deixe vazio)  
**Install Command:** (deixe vazio)  

### 4.4 Fazer Deploy
1. Clique em **"Deploy"**
2. Aguarde o deploy finalizar (1-2 minutos)
3. Você receberá uma URL temporária (ex: `proposta-contabil-app.vercel.app`)

## 🔗 PASSO 5 - CONFIGURAR DOMÍNIO PERSONALIZADO

### 5.1 Adicionar Domínio no Vercel
1. No painel do Vercel, vá para **"Settings"** > **"Domains"**
2. Clique em **"Add"**
3. Digite: `app.propostacontabil.com.br`
4. Clique em **"Add"**

### 5.2 Configurar DNS na Hostinger
1. Acesse o painel da Hostinger
2. Vá para **"Gerenciar Domínio"** > **"DNS"**
3. Adicione um registro CNAME:
   - **Tipo:** CNAME
   - **Nome:** app
   - **Valor:** cname.vercel-dns.com
   - **TTL:** 3600

### 5.3 Aguardar Propagação
1. A propagação pode levar de 5 minutos a 24 horas
2. Teste acessando: `app.propostacontabil.com.br`

## ✅ PASSO 6 - TESTAR SISTEMA

### 6.1 Verificações
1. ✅ Acesse `app.propostacontabil.com.br`
2. ✅ Teste login com `admin` / `123456`
3. ✅ Navegue entre as páginas
4. ✅ Teste criar um cliente
5. ✅ Teste gerar uma proposta
6. ✅ Verifique responsividade no celular

### 6.2 Se Algo Não Funcionar
1. Verifique se todos os arquivos foram enviados
2. Confira se a estrutura de pastas está correta
3. Teste primeiro na URL temporária do Vercel
4. Verifique as configurações de DNS

## 🔄 PASSO 7 - ATUALIZAÇÕES FUTURAS

### Para Atualizar o Sistema:
1. Faça as alterações nos arquivos locais
2. Faça upload dos arquivos alterados no GitHub
3. O Vercel fará deploy automático
4. As mudanças aparecerão em `app.propostacontabil.com.br`

### Via Interface GitHub:
1. Acesse o repositório no GitHub
2. Navegue até o arquivo que quer editar
3. Clique no ícone de lápis (Edit)
4. Faça as alterações
5. Clique em **"Commit changes"**

## 🆘 SOLUÇÃO DE PROBLEMAS

### Problema: Site não carrega
**Solução:** Verifique se o arquivo `index.html` está na raiz do repositório

### Problema: CSS não aparece
**Solução:** Verifique se os caminhos dos arquivos CSS estão corretos

### Problema: Domínio não funciona
**Solução:** Aguarde até 24h para propagação DNS ou verifique configurações

### Problema: JavaScript não funciona
**Solução:** Abra o console do navegador (F12) e verifique erros

## 📞 SUPORTE

Se precisar de ajuda:
1. Verifique este guia novamente
2. Consulte a documentação do GitHub/Vercel
3. Entre em contato para suporte técnico

---

**🎉 PARABÉNS! Seu sistema está no ar!**

Agora você tem:
- ✅ Código versionado no GitHub
- ✅ Sistema online em `app.propostacontabil.com.br`
- ✅ Deploy automático configurado
- ✅ SSL/HTTPS funcionando

