# 📦 Guia de Instalação - Sistema Libertá

## 🎯 Instalação Completa

### 1️⃣ Frontend (Interface Web)

```bash
# Instalar dependências do frontend
npm install

# Build do frontend
npm run build
```

### 2️⃣ Backend (API + Banco de Dados)

```bash
# Ir para a pasta do servidor
cd server

# Instalar dependências do backend
npm install

# Voltar para a raiz
cd ..
```

### 3️⃣ Rodar o Sistema

```bash
# A partir da raiz do projeto, rodar o servidor
# Ele serve a API na porta 3001 e também serve o frontend do build
node server/index.cjs
```

O sistema estará disponível em: **http://localhost:3001**

---

## 🚀 Deploy em Produção

### Hostinger / VPS

1. **Upload dos arquivos** para o servidor

2. **Instalar Node.js** no servidor (versão 18 ou superior)

3. **Executar os comandos**:
```bash
# Frontend
npm install
npm run build

# Backend
cd server
npm install
cd ..

# Rodar (ou usar PM2)
node server/index.cjs
```

4. **Usar PM2 para manter rodando** (opcional mas recomendado):
```bash
npm install -g pm2
pm2 start server/index.cjs --name liberta
pm2 save
pm2 startup
```

---

## 📋 Comandos Úteis

### Desenvolvimento
```bash
# Frontend com hot reload (porta 5173)
npm run dev

# Backend separado (porta 3001)
cd server && node index.cjs
```

### Produção
```bash
# Build + Start completo
npm run build && node server/index.cjs
```

### PM2
```bash
# Ver status
pm2 status

# Ver logs
pm2 logs liberta

# Restart
pm2 restart liberta

# Stop
pm2 stop liberta
```

---

## 🔧 Requisitos do Sistema

- **Node.js**: versão 18 ou superior
- **NPM**: versão 8 ou superior
- **Python**: necessário apenas para compilar better-sqlite3 durante instalação
- **Espaço em disco**: ~200MB para node_modules + aplicação

---

## ⚙️ Variáveis de Ambiente

O backend gera automaticamente um arquivo `.env` na pasta `server/` com:
- `JWT_SECRET`: Chave secreta para tokens JWT (gerada automaticamente)

Para produção, você pode criar o arquivo `.env` manualmente:
```env
JWT_SECRET=sua-chave-secreta-aqui
PORT=3001
```

---

## 🗄️ Banco de Dados

- **Tipo**: SQLite
- **Localização**: `server/data/app.db`
- **Criação**: Automática na primeira execução
- **Backup**: Copie o arquivo `server/data/app.db`

### Tabelas criadas automaticamente:
- `users` - Usuários do sistema
- `atendimentos` - Atendimentos dos clientes
- `tarot_analises` - Análises de tarot

---

## 🔐 Primeiro Acesso

Após rodar o sistema pela primeira vez:
1. Acesse http://localhost:3001
2. Clique em "Cadastre-se"
3. Crie sua conta com nome, email e senha
4. Faça login e comece a usar!

Todos os dados ficam isolados por usuário (user_id).

---

## 🆘 Problemas Comuns

### Erro "Python not found" ao instalar
**Causa**: better-sqlite3 precisa do Python para compilar

**Solução Windows**:
- Instale Python de https://www.python.org/downloads/
- Marque "Add Python to PATH" durante instalação

**Solução Linux/Mac**:
```bash
# Ubuntu/Debian
sudo apt-get install python3 build-essential

# Mac
xcode-select --install
```

### Porta 3001 já está em uso
**Solução**: Altere a porta no `.env`:
```env
PORT=8080
```

### Erro ao acessar API
**Verifique**:
- Backend está rodando? `node server/index.cjs`
- Porta correta? Padrão é 3001
- Firewall bloqueando?

---

## 📞 Suporte

Para problemas ou dúvidas, verifique:
- README.md - Documentação geral
- server/index.cjs - Código do backend com comentários
- Console do navegador (F12) - Erros do frontend
