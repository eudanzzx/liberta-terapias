
// server/index.cjs
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure data dir
const dataDir = path.join(__dirname, 'data');
fs.mkdirSync(dataDir, { recursive: true });

// DB setup (.db file)
const dbPath = path.join(dataDir, 'app.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Migrations
db.exec(`
  CREATE TABLE IF NOT EXISTS atendimentos (
    id TEXT PRIMARY KEY,
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
    updated_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS tarot_analises (
    id TEXT PRIMARY KEY,
    cliente TEXT NOT NULL,
    pergunta TEXT,
    cartas TEXT,
    interpretacao TEXT,
    dataAnalise TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
`);

app.use(cors());
app.use(express.json());

function nowIso() { return new Date().toISOString(); }

// Health
app.get('/api/health', (_, res) => res.json({ ok: true, db: dbPath }));

// Atendimentos CRUD
app.get('/api/atendimentos', (req, res) => {
  const rows = db.prepare('SELECT * FROM atendimentos ORDER BY datetime(dataAtendimento) DESC, created_at DESC').all();
  res.json(rows);
});
app.get('/api/atendimentos/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM atendimentos WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});
app.post('/api/atendimentos', (req, res) => {
  const a = req.body || {};
  const required = ['id','nome','tipoServico','statusPagamento','dataAtendimento','valor'];
  for (const k of required) if (!a[k]) return res.status(400).json({ error: `Campo obrigatório: ${k}` });
  a.created_at = nowIso(); a.updated_at = nowIso();
  const stmt = db.prepare(`INSERT INTO atendimentos
    (id, nome, dataNascimento, telefone, signo, tipoServico, statusPagamento, dataAtendimento, valor, destino, cidade, observacoes, created_at, updated_at)
    VALUES (@id, @nome, @dataNascimento, @telefone, @signo, @tipoServico, @statusPagamento, @dataAtendimento, @valor, @destino, @cidade, @observacoes, @created_at, @updated_at)`);
  stmt.run(a);
  res.status(201).json(a);
});
app.put('/api/atendimentos/:id', (req, res) => {
  const id = req.params.id;
  const existing = db.prepare('SELECT * FROM atendimentos WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  const a = { ...existing, ...req.body, id, updated_at: nowIso() };
  const stmt = db.prepare(`UPDATE atendimentos SET
    nome=@nome, dataNascimento=@dataNascimento, telefone=@telefone, signo=@signo,
    tipoServico=@tipoServico, statusPagamento=@statusPagamento, dataAtendimento=@dataAtendimento,
    valor=@valor, destino=@destino, cidade=@cidade, observacoes=@observacoes, updated_at=@updated_at
    WHERE id=@id`);
  stmt.run(a);
  res.json(a);
});
app.delete('/api/atendimentos/:id', (req, res) => {
  const info = db.prepare('DELETE FROM atendimentos WHERE id = ?').run(req.params.id);
  res.json({ deleted: info.changes > 0 });
});

// Tarot Analises CRUD
app.get('/api/tarot-analises', (req, res) => {
  const rows = db.prepare('SELECT * FROM tarot_analises ORDER BY datetime(dataAnalise) DESC, created_at DESC').all();
  res.json(rows);
});
app.post('/api/tarot-analises', (req, res) => {
  const t = req.body || {};
  if (!t.id || !t.cliente || !t.dataAnalise) return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  t.created_at = nowIso(); t.updated_at = nowIso();
  if (Array.isArray(t.cartas)) t.cartas = JSON.stringify(t.cartas);
  const stmt = db.prepare(`INSERT INTO tarot_analises
    (id, cliente, pergunta, cartas, interpretacao, dataAnalise, created_at, updated_at)
    VALUES (@id, @cliente, @pergunta, @cartas, @interpretacao, @dataAnalise, @created_at, @updated_at)`);
  stmt.run(t);
  res.status(201).json(t);
});
app.put('/api/tarot-analises/:id', (req, res) => {
  const id = req.params.id;
  const existing = db.prepare('SELECT * FROM tarot_analises WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  const t = { ...existing, ...req.body, id, updated_at: nowIso() };
  if (Array.isArray(t.cartas)) t.cartas = JSON.stringify(t.cartas);
  const stmt = db.prepare(`UPDATE tarot_analises SET
    cliente=@cliente, pergunta=@pergunta, cartas=@cartas, interpretacao=@interpretacao, dataAnalise=@dataAnalise, updated_at=@updated_at
    WHERE id=@id`);
  stmt.run(t);
  res.json(t);
});
app.delete('/api/tarot-analises/:id', (req, res) => {
  const info = db.prepare('DELETE FROM tarot_analises WHERE id = ?').run(req.params.id);
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
