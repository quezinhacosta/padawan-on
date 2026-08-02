const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Caminho do banco de dados
const dbPath = path.join(__dirname, '../../database.sqlite');

// Criar arquivo se não existir
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, '');
  console.log('📁 Arquivo database.sqlite criado');
}

// Conectar ao banco
const db = new Database(dbPath);

// Habilitar chaves estrangeiras
db.pragma('foreign_keys = ON');

console.log('✅ Conectado ao banco de dados SQLite');

// Funções de usuário
function getUsuarioByRA(ra) {
  const stmt = db.prepare('SELECT * FROM usuarios WHERE ra = ?');
  return stmt.get(ra);
}

function getUsuarioByEmail(email) {
  const stmt = db.prepare('SELECT * FROM usuarios WHERE email = ?');
  return stmt.get(email);
}

function createUsuario(dados) {
  const stmt = db.prepare(`
    INSERT INTO usuarios (nome_usuario, nome_completo, email, ra, senha_hash, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    dados.nomeUsuario,
    dados.nomeCompleto,
    dados.email,
    dados.ra,
    dados.senhaHash,
    dados.role
  );
}

function getAllUsuarios() {
  const stmt = db.prepare('SELECT * FROM usuarios ORDER BY nome_completo');
  return stmt.all();
}

// Funções de calouro
function createCalouro(dados) {
  const stmt = db.prepare(`
    INSERT INTO calouros (usuario_id, curso, periodo)
    VALUES (?, ?, ?)
  `);
  return stmt.run(dados.usuarioId, dados.curso, dados.periodo);
}

// Exportar
module.exports = {
  db,
  getUsuarioByRA,
  getUsuarioByEmail,
  createUsuario,
  getAllUsuarios,
  createCalouro
};