# Sistema Libertá - Gestão de Atendimentos

Sistema completo de gestão de atendimentos com autenticação JWT, backend em Node.js/Express/SQLite e frontend em React/Vite.

## 🚀 Instalação Rápida

```bash
# 1. Frontend
npm install
npm run build

# 2. Backend
cd server
npm install
cd ..

# 3. Rodar
node server/index.cjs
```

Acesse: **http://localhost:3001**

> **📖 Guia completo**: Veja [INSTALACAO.md](./INSTALACAO.md) para instruções detalhadas

---

## 📋 Funcionalidades

- ✅ **Autenticação JWT** completa (registro + login)
- ✅ **Cadastro de usuários** com senhas criptografadas (bcrypt)
- ✅ **Gestão de atendimentos** isolada por usuário
- ✅ **Análises de Tarot** vinculadas ao usuário
- ✅ **API REST** protegida com middleware de autenticação
- ✅ **SQLite** como banco de dados
- ✅ **Interface moderna** com TailwindCSS

---

## 🔐 Autenticação

### Criar Conta
**POST** `/api/auth/register`
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

### Login
**POST** `/api/auth/login`
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "abc123",
    "name": "João Silva",
    "email": "joao@example.com"
  }
}
```

---

## 📊 API Endpoints

Todas as rotas requerem header de autenticação:
```
Authorization: Bearer <seu-token-jwt>
```

### Atendimentos
- `GET /api/atendimentos` - Listar todos do usuário
- `GET /api/atendimentos/:id` - Obter um específico
- `POST /api/atendimentos` - Criar novo
- `PUT /api/atendimentos/:id` - Atualizar
- `DELETE /api/atendimentos/:id` - Deletar

### Análises de Tarot
- `GET /api/tarot-analises` - Listar todas do usuário
- `POST /api/tarot-analises` - Criar nova
- `PUT /api/tarot-analises/:id` - Atualizar
- `DELETE /api/tarot-analises/:id` - Deletar

---

## 🗄️ Banco de Dados

**Tipo**: SQLite  
**Arquivo**: `server/data/app.db`  
**Criação**: Automática

### Estrutura

#### Tabela: users
```sql
- id: TEXT PRIMARY KEY
- name: TEXT NOT NULL
- email: TEXT UNIQUE NOT NULL
- password: TEXT NOT NULL (bcrypt hash)
- created_at: TEXT
```

#### Tabela: atendimentos
```sql
- id: TEXT PRIMARY KEY
- user_id: TEXT NOT NULL (FK -> users.id)
- nome: TEXT NOT NULL
- dataNascimento: TEXT
- telefone: TEXT
- signo: TEXT
- tipoServico: TEXT NOT NULL
- statusPagamento: TEXT NOT NULL
- dataAtendimento: TEXT NOT NULL
- valor: TEXT NOT NULL
- destino: TEXT
- cidade: TEXT
- observacoes: TEXT
- created_at: TEXT
- updated_at: TEXT
```

#### Tabela: tarot_analises
```sql
- id: TEXT PRIMARY KEY
- user_id: TEXT NOT NULL (FK -> users.id)
- cliente: TEXT NOT NULL
- pergunta: TEXT
- cartas: TEXT
- interpretacao: TEXT
- dataAnalise: TEXT NOT NULL
- created_at: TEXT
- updated_at: TEXT
```

---

## 🔒 Segurança

- **Senhas**: Criptografadas com bcrypt (10 rounds)
- **JWT**: Tokens com validade de 7 dias
- **Isolamento**: Dados vinculados ao `user_id` (RLS simulado)
- **Validação**: Middleware verifica token em todas as rotas protegidas
- **CORS**: Configurado para permitir requisições cross-origin

---

## 🌐 Deploy

### Hostinger / VPS

1. Upload dos arquivos
2. Instalar Node.js 18+
3. Executar:
```bash
npm install && npm run build
cd server && npm install && cd ..
node server/index.cjs
```

### Com PM2 (Recomendado)
```bash
npm install -g pm2
pm2 start server/index.cjs --name liberta
pm2 save
pm2 startup
```

---

## 📁 Estrutura do Projeto

```
/
├── server/
│   ├── data/           # SQLite database
│   ├── index.cjs       # Backend Express
│   ├── package.json    # Dependências backend
│   └── .env           # JWT_SECRET (gerado auto)
├── src/
│   ├── components/     # Componentes React
│   ├── contexts/       # AuthContext com JWT
│   ├── pages/          # Login, Register, Dashboard
│   └── services/       # API services
├── dist/               # Build frontend (gerado)
├── package.json        # Dependências frontend
├── README.md
└── INSTALACAO.md       # Guia detalhado
```

---

## 🛠️ Tecnologias

**Frontend**:
- React 18
- Vite
- TailwindCSS
- React Router
- Tanstack Query

**Backend**:
- Node.js
- Express
- SQLite (better-sqlite3)
- bcryptjs
- jsonwebtoken

---

## 🔧 Desenvolvimento

### Frontend (dev com hot reload)
```bash
npm run dev
# Acesse http://localhost:5173
```

### Backend (separado)
```bash
cd server
node index.cjs
# Roda na porta 3001
```

### Produção
```bash
npm run build
node server/index.cjs
# Tudo em http://localhost:3001
```

---

## 📝 Variáveis de Ambiente

### Backend (`server/.env`)
```env
JWT_SECRET=<gerado-automaticamente>
PORT=3001
```

### Frontend (`.env.local` - opcional)
```env
VITE_API_URL=http://localhost:3001
```

---

## 🎯 Primeiros Passos

1. **Instale tudo** (veja [INSTALACAO.md](./INSTALACAO.md))
2. **Rode o servidor**: `node server/index.cjs`
3. **Acesse**: http://localhost:3001
4. **Cadastre-se** com nome, email e senha
5. **Faça login** e use o sistema!

---

## 📞 Suporte

- Documentação completa: [INSTALACAO.md](./INSTALACAO.md)
- Código comentado: `server/index.cjs`
- Console do navegador: F12 para debug

---

## 📄 Licença

Este projeto é privado e proprietário.
