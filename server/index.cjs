
// server/index.cjs
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;

// Generate JWT secret if .env doesn't exist
const envPath = path.join(__dirname, '.env');
let JWT_SECRET;
if (!fs.existsSync(envPath)) {
  JWT_SECRET = require('crypto').randomBytes(64).toString('hex');
  fs.writeFileSync(envPath, `JWT_SECRET=${JWT_SECRET}\n`);
  console.log('✅ Generated .env file with JWT_SECRET');
} else {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/JWT_SECRET=(.+)/);
  JWT_SECRET = match ? match[1].trim() : require('crypto').randomBytes(64).toString('hex');
  if (!match) {
    fs.appendFileSync(envPath, `JWT_SECRET=${JWT_SECRET}\n`);
  }
}

// Ensure data dir
const dataDir = path.join(__dirname, 'data');
fs.mkdirSync(dataDir, { recursive: true });

// DB setup (.db file)
const dbPath = path.join(dataDir, 'app.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Migrations
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS atendimentos (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    nome TEXT NOT NULL,
    dataNascimento TEXT,
    telefone TEXT,
    signo TEXT,
    tipoServico TEXT NOT NULL,
    statusPagamento TEXT NOT NULL,
    dataAtendimento TEXT NOT NULL,
    valor TEXT NOT NULL,
    destino TEXT,
    cidade TEXT,
    observacoes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS tarot_analises (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    cliente TEXT NOT NULL,
    pergunta TEXT,
    cartas TEXT,
    interpretacao TEXT,
    dataAnalise TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

app.use(cors());
app.use(express.json());

function nowIso() { return new Date().toISOString(); }

// JWT Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
}

// Health
app.get('/api/health', (_, res) => res.json({ ok: true, db: dbPath }));

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    // Check if user exists
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email já está em uso' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const userId = require('crypto').randomBytes(16).toString('hex');
    db.prepare('INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)').run(
      userId, name, email, hashedPassword
    );
    
    // Generate token
    const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      token,
      user: { id: userId, name, email }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Erro ao criar conta' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
    
    // Find user
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }
    
    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Atendimentos CRUD (Protected)
app.get('/api/atendimentos', authenticateToken, (req, res) => {
  const rows = db.prepare('SELECT * FROM atendimentos WHERE user_id = ? ORDER BY datetime(dataAtendimento) DESC, created_at DESC').all(req.user.id);
  res.json(rows);
});
app.get('/api/atendimentos/:id', authenticateToken, (req, res) => {
  const row = db.prepare('SELECT * FROM atendimentos WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});
app.post('/api/atendimentos', authenticateToken, (req, res) => {
  const a = req.body || {};
  const required = ['id','nome','tipoServico','statusPagamento','dataAtendimento','valor'];
  for (const k of required) if (!a[k]) return res.status(400).json({ error: `Campo obrigatório: ${k}` });
  a.user_id = req.user.id;
  a.created_at = nowIso(); 
  a.updated_at = nowIso();
  const stmt = db.prepare(`INSERT INTO atendimentos
    (id, user_id, nome, dataNascimento, telefone, signo, tipoServico, statusPagamento, dataAtendimento, valor, destino, cidade, observacoes, created_at, updated_at)
    VALUES (@id, @user_id, @nome, @dataNascimento, @telefone, @signo, @tipoServico, @statusPagamento, @dataAtendimento, @valor, @destino, @cidade, @observacoes, @created_at, @updated_at)`);
  stmt.run(a);
  res.status(201).json(a);
});
app.put('/api/atendimentos/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  const existing = db.prepare('SELECT * FROM atendimentos WHERE id = ? AND user_id = ?').get(id, req.user.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  const a = { ...existing, ...req.body, id, user_id: req.user.id, updated_at: nowIso() };
  const stmt = db.prepare(`UPDATE atendimentos SET
    nome=@nome, dataNascimento=@dataNascimento, telefone=@telefone, signo=@signo,
    tipoServico=@tipoServico, statusPagamento=@statusPagamento, dataAtendimento=@dataAtendimento,
    valor=@valor, destino=@destino, cidade=@cidade, observacoes=@observacoes, updated_at=@updated_at
    WHERE id=@id AND user_id=@user_id`);
  stmt.run(a);
  res.json(a);
});
app.delete('/api/atendimentos/:id', authenticateToken, (req, res) => {
  const info = db.prepare('DELETE FROM atendimentos WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ deleted: info.changes > 0 });
});

// Tarot Analises CRUD (Protected)
app.get('/api/tarot-analises', authenticateToken, (req, res) => {
  const rows = db.prepare('SELECT * FROM tarot_analises WHERE user_id = ? ORDER BY datetime(dataAnalise) DESC, created_at DESC').all(req.user.id);
  res.json(rows);
});
app.post('/api/tarot-analises', authenticateToken, (req, res) => {
  const t = req.body || {};
  if (!t.id || !t.cliente || !t.dataAnalise) return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  t.user_id = req.user.id;
  t.created_at = nowIso(); 
  t.updated_at = nowIso();
  if (Array.isArray(t.cartas)) t.cartas = JSON.stringify(t.cartas);
  const stmt = db.prepare(`INSERT INTO tarot_analises
    (id, user_id, cliente, pergunta, cartas, interpretacao, dataAnalise, created_at, updated_at)
    VALUES (@id, @user_id, @cliente, @pergunta, @cartas, @interpretacao, @dataAnalise, @created_at, @updated_at)`);
  stmt.run(t);
  res.status(201).json(t);
});
app.put('/api/tarot-analises/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  const existing = db.prepare('SELECT * FROM tarot_analises WHERE id = ? AND user_id = ?').get(id, req.user.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  const t = { ...existing, ...req.body, id, user_id: req.user.id, updated_at: nowIso() };
  if (Array.isArray(t.cartas)) t.cartas = JSON.stringify(t.cartas);
  const stmt = db.prepare(`UPDATE tarot_analises SET
    cliente=@cliente, pergunta=@pergunta, cartas=@cartas, interpretacao=@interpretacao, dataAnalise=@dataAnalise, updated_at=@updated_at
    WHERE id=@id AND user_id=@user_id`);
  stmt.run(t);
  res.json(t);
});
app.delete('/api/tarot-analises/:id', authenticateToken, (req, res) => {
  const info = db.prepare('DELETE FROM tarot_analises WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ deleted: info.changes > 0 });
});

// Serve frontend build (production)
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
  console.log(`SQLite DB: ${dbPath}`);
  if (fs.existsSync(distPath)) {
    console.log(`Serving static frontend from ${distPath}`);
  } else {
    console.log('No dist/ folder found. In dev, use Vite on another port.');
  }
});
