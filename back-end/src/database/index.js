const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../../database.sqlite');

let db;

try {
  const Database = require('better-sqlite3');
  db = new Database(dbPath);
  db.pragma('foreign_keys = ON');
} catch (err) {
  try {
    const { DatabaseSync } = require('node:sqlite');
    db = new DatabaseSync(dbPath);
    db.exec('PRAGMA foreign_keys = ON;');
  } catch (innerErr) {
    throw innerErr;
  }
}

function initDb() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);
  }
  try {
    db.exec('ALTER TABLE usuarios ADD COLUMN foto_perfil TEXT;');
  } catch (err) {}
}

initDb();

function getUsuarioByIdentifier(identifier) {
  const stmt = db.prepare('SELECT * FROM usuarios WHERE ra = ? OR email = ? OR nome_usuario = ?');
  return stmt.get(identifier, identifier, identifier);
}

function getUsuarioByRA(ra) {
  const stmt = db.prepare('SELECT * FROM usuarios WHERE ra = ?');
  return stmt.get(ra);
}

function getUsuarioByEmail(email) {
  const stmt = db.prepare('SELECT * FROM usuarios WHERE email = ?');
  return stmt.get(email);
}

function getUsuarioById(id) {
  const stmt = db.prepare('SELECT id, nome_usuario, nome_completo, email, ra, role, foto_perfil, ativo, created_at FROM usuarios WHERE id = ?');
  return stmt.get(id);
}

function getAllUsuarios(role = null) {
  if (role) {
    const stmt = db.prepare('SELECT id, nome_usuario, nome_completo, email, ra, role, foto_perfil, ativo, created_at FROM usuarios WHERE role = ? ORDER BY nome_completo');
    return stmt.all(role);
  }
  const stmt = db.prepare('SELECT id, nome_usuario, nome_completo, email, ra, role, foto_perfil, ativo, created_at FROM usuarios ORDER BY nome_completo');
  return stmt.all();
}

function createUsuario({ nomeUsuario, nomeCompleto, email, ra, senhaHash, role = 'CALOURO', ativo = 1 }) {
  const stmt = db.prepare(`
    INSERT INTO usuarios (nome_usuario, nome_completo, email, ra, senha_hash, role, ativo)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(nomeUsuario, nomeCompleto, email, ra, senhaHash, role, ativo);
}

function updateUsuario(id, { nomeUsuario, nomeCompleto, email, fotoPerfil, ativo, senhaHash }) {
  if (senhaHash) {
    const stmt = db.prepare(`
      UPDATE usuarios 
      SET nome_usuario = COALESCE(?, nome_usuario),
          nome_completo = COALESCE(?, nome_completo),
          email = COALESCE(?, email),
          foto_perfil = COALESCE(?, foto_perfil),
          ativo = COALESCE(?, ativo),
          senha_hash = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(nomeUsuario, nomeCompleto, email, fotoPerfil, ativo, senhaHash, id);
  }
  const stmt = db.prepare(`
    UPDATE usuarios 
    SET nome_usuario = COALESCE(?, nome_usuario),
        nome_completo = COALESCE(?, nome_completo),
        email = COALESCE(?, email),
        foto_perfil = COALESCE(?, foto_perfil),
        ativo = COALESCE(?, ativo),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  return stmt.run(nomeUsuario, nomeCompleto, email, fotoPerfil, ativo, id);
}

function deleteUsuario(id) {
  const stmt = db.prepare('DELETE FROM usuarios WHERE id = ?');
  return stmt.run(id);
}

function getAllMentores() {
  const stmt = db.prepare(`
    SELECT 
      m.id,
      m.usuario_id,
      u.nome_completo as nome,
      u.nome_usuario,
      u.email,
      u.ra,
      u.ativo,
      m.disponivel,
      m.max_calouros,
      m.especialidades,
      m.avaliacao_media,
      (
        SELECT COUNT(cg.id)
        FROM grupos g
        LEFT JOIN calouros_grupos cg ON cg.grupo_id = g.id AND cg.status = 'ATIVO'
        WHERE g.mentor_id = m.id AND g.status = 'ATIVO'
      ) as calouros_atendidos
    FROM mentores m
    JOIN usuarios u ON u.id = m.usuario_id
    ORDER BY u.nome_completo
  `);
  return stmt.all();
}

function getMentorById(id) {
  const stmt = db.prepare(`
    SELECT 
      m.*,
      u.nome_completo as nome,
      u.nome_usuario,
      u.email,
      u.ra,
      u.ativo
    FROM mentores m
    JOIN usuarios u ON u.id = m.usuario_id
    WHERE m.id = ?
  `);
  return stmt.get(id);
}

function getMentorByUsuarioId(usuarioId) {
  const stmt = db.prepare(`
    SELECT 
      m.*,
      u.nome_completo as nome,
      u.nome_usuario,
      u.email,
      u.ra,
      u.ativo
    FROM mentores m
    JOIN usuarios u ON u.id = m.usuario_id
    WHERE m.usuario_id = ?
  `);
  return stmt.get(usuarioId);
}

function createMentor({ usuarioId, disponivel = 1, maxCalouros = 5, especialidades = '' }) {
  const stmt = db.prepare(`
    INSERT INTO mentores (usuario_id, disponivel, max_calouros, especialidades)
    VALUES (?, ?, ?, ?)
  `);
  return stmt.run(usuarioId, disponivel, maxCalouros, especialidades);
}

function updateMentor(id, { disponivel, maxCalouros, especialidades }) {
  const stmt = db.prepare(`
    UPDATE mentores
    SET disponivel = COALESCE(?, disponivel),
        max_calouros = COALESCE(?, max_calouros),
        especialidades = COALESCE(?, especialidades),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  return stmt.run(disponivel, maxCalouros, especialidades, id);
}

function deleteMentor(id) {
  const mentor = db.prepare('SELECT usuario_id FROM mentores WHERE id = ?').get(id);
  db.prepare('UPDATE grupos SET mentor_id = NULL WHERE mentor_id = ?').run(id);
  db.prepare('DELETE FROM mentores WHERE id = ?').run(id);
  if (mentor && mentor.usuario_id) {
    db.prepare('DELETE FROM usuarios WHERE id = ?').run(mentor.usuario_id);
  }
}

function getMentorCalouros(mentorId) {
  const stmt = db.prepare(`
    SELECT 
      c.id,
      c.curso,
      c.periodo,
      u.nome_completo as nome,
      u.email,
      u.ra,
      g.nome as grupo_nome,
      g.id as grupo_id
    FROM grupos g
    JOIN calouros_grupos cg ON cg.grupo_id = g.id AND cg.status = 'ATIVO'
    JOIN calouros c ON c.id = cg.calouro_id
    JOIN usuarios u ON u.id = c.usuario_id
    WHERE g.mentor_id = ?
    ORDER BY u.nome_completo
  `);
  return stmt.all(mentorId);
}

function getAllCalouros() {
  const stmt = db.prepare(`
    SELECT 
      c.id,
      c.usuario_id,
      c.curso,
      c.periodo,
      c.data_ingresso,
      u.nome_completo as nome,
      u.nome_usuario,
      u.email,
      u.ra,
      u.ativo,
      g.id as grupo_id,
      g.nome as grupo_nome,
      um.nome_completo as mentor_nome,
      um.email as mentor_email
    FROM calouros c
    JOIN usuarios u ON u.id = c.usuario_id
    LEFT JOIN calouros_grupos cg ON cg.calouro_id = c.id AND cg.status = 'ATIVO'
    LEFT JOIN grupos g ON g.id = cg.grupo_id
    LEFT JOIN mentores m ON m.id = g.mentor_id
    LEFT JOIN usuarios um ON um.id = m.usuario_id
    ORDER BY u.nome_completo
  `);
  return stmt.all();
}

function getCalouroById(id) {
  const stmt = db.prepare(`
    SELECT 
      c.*,
      u.nome_completo as nome,
      u.nome_usuario,
      u.email,
      u.ra,
      u.ativo,
      g.id as grupo_id,
      g.nome as grupo_nome,
      um.nome_completo as mentor_nome,
      um.email as mentor_email,
      m.disponivel as mentor_disponivel
    FROM calouros c
    JOIN usuarios u ON u.id = c.usuario_id
    LEFT JOIN calouros_grupos cg ON cg.calouro_id = c.id AND cg.status = 'ATIVO'
    LEFT JOIN grupos g ON g.id = cg.grupo_id
    LEFT JOIN mentores m ON m.id = g.mentor_id
    LEFT JOIN usuarios um ON um.id = m.usuario_id
    WHERE c.id = ?
  `);
  return stmt.get(id);
}

function getCalouroByUsuarioId(usuarioId) {
  const stmt = db.prepare(`
    SELECT 
      c.*,
      u.nome_completo as nome,
      u.nome_usuario,
      u.email,
      u.ra,
      u.ativo,
      g.id as grupo_id,
      g.nome as grupo_nome,
      um.nome_completo as mentor_nome,
      um.email as mentor_email,
      m.disponivel as mentor_disponivel
    FROM calouros c
    JOIN usuarios u ON u.id = c.usuario_id
    LEFT JOIN calouros_grupos cg ON cg.calouro_id = c.id AND cg.status = 'ATIVO'
    LEFT JOIN grupos g ON g.id = cg.grupo_id
    LEFT JOIN mentores m ON m.id = g.mentor_id
    LEFT JOIN usuarios um ON um.id = m.usuario_id
    WHERE c.usuario_id = ?
  `);
  return stmt.get(usuarioId);
}

function createCalouro({ usuarioId, curso = 'Ciência da Computação', periodo = '1º Período' }) {
  const stmt = db.prepare(`
    INSERT INTO calouros (usuario_id, curso, periodo)
    VALUES (?, ?, ?)
  `);
  return stmt.run(usuarioId, curso, periodo);
}

function updateCalouro(id, { curso, periodo }) {
  const stmt = db.prepare(`
    UPDATE calouros
    SET curso = COALESCE(?, curso),
        periodo = COALESCE(?, periodo),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  return stmt.run(curso, periodo, id);
}

function deleteCalouro(id) {
  const calouro = db.prepare('SELECT usuario_id FROM calouros WHERE id = ?').get(id);
  db.prepare('DELETE FROM calouros_grupos WHERE calouro_id = ?').run(id);
  db.prepare('DELETE FROM frequencia WHERE calouro_id = ?').run(id);
  db.prepare('DELETE FROM calouros WHERE id = ?').run(id);
  if (calouro && calouro.usuario_id) {
    db.prepare('DELETE FROM usuarios WHERE id = ?').run(calouro.usuario_id);
  }
}

function getAllGrupos() {
  const stmt = db.prepare(`
    SELECT 
      g.id,
      g.nome,
      g.status,
      g.descricao,
      g.data_criacao,
      g.created_at,
      m.id as mentor_id,
      um.nome_completo as mentor_nome,
      um.email as mentor_email,
      (
        SELECT MIN(e.data_hora)
        FROM encontros e
        WHERE e.grupo_id = g.id AND e.status = 'AGENDADO' AND e.data_hora >= datetime('now')
      ) as proximo_encontro
    FROM grupos g
    LEFT JOIN mentores m ON m.id = g.mentor_id
    LEFT JOIN usuarios um ON um.id = m.usuario_id
    ORDER BY g.nome
  `);
  const grupos = stmt.all();

  const calourosStmt = db.prepare(`
    SELECT 
      c.id as calouro_id,
      u.nome_completo as nome,
      u.ra,
      u.email
    FROM calouros_grupos cg
    JOIN calouros c ON c.id = cg.calouro_id
    JOIN usuarios u ON u.id = c.usuario_id
    WHERE cg.grupo_id = ? AND cg.status = 'ATIVO'
    ORDER BY u.nome_completo
  `);

  return grupos.map(grupo => ({
    ...grupo,
    calouros: calourosStmt.all(grupo.id)
  }));
}

function getGrupoById(id) {
  const stmt = db.prepare(`
    SELECT 
      g.*,
      m.id as mentor_id,
      um.nome_completo as mentor_nome,
      um.email as mentor_email
    FROM grupos g
    LEFT JOIN mentores m ON m.id = g.mentor_id
    LEFT JOIN usuarios um ON um.id = m.usuario_id
    WHERE g.id = ?
  `);
  const grupo = stmt.get(id);
  if (!grupo) return null;

  const calourosStmt = db.prepare(`
    SELECT 
      c.id as calouro_id,
      u.nome_completo as nome,
      u.ra,
      u.email,
      cg.data_entrada
    FROM calouros_grupos cg
    JOIN calouros c ON c.id = cg.calouro_id
    JOIN usuarios u ON u.id = c.usuario_id
    WHERE cg.grupo_id = ? AND cg.status = 'ATIVO'
    ORDER BY u.nome_completo
  `);
  grupo.calouros = calourosStmt.all(id);
  return grupo;
}

function getOrientadorByUsuarioId(usuarioId) {
  const stmt = db.prepare('SELECT * FROM orientadores WHERE usuario_id = ?');
  return stmt.get(usuarioId);
}

function createGrupo({ nome, mentorId = null, orientadorId = null, descricao = '', status = 'ATIVO' }) {
  let finalOrientadorId = null;
  if (orientadorId) {
    const direct = db.prepare('SELECT id FROM orientadores WHERE id = ?').get(orientadorId);
    if (direct) {
      finalOrientadorId = direct.id;
    } else {
      const byUser = db.prepare('SELECT id FROM orientadores WHERE usuario_id = ?').get(orientadorId);
      if (byUser) {
        finalOrientadorId = byUser.id;
      } else {
        const user = db.prepare('SELECT id FROM usuarios WHERE id = ? AND role = "ORIENTADOR"').get(orientadorId);
        if (user) {
          const created = db.prepare('INSERT INTO orientadores (usuario_id, departamento, cargo) VALUES (?, ?, ?)').run(user.id, 'Ciência da Computação', 'Orientador');
          finalOrientadorId = created.lastInsertRowid;
        }
      }
    }
  }

  const stmt = db.prepare(`
    INSERT INTO grupos (nome, mentor_id, orientador_id, descricao, status)
    VALUES (?, ?, ?, ?, ?)
  `);
  return stmt.run(nome, mentorId, finalOrientadorId, descricao, status);
}

function updateGrupo(id, { nome, mentorId, descricao, status }) {
  const stmt = db.prepare(`
    UPDATE grupos
    SET nome = COALESCE(?, nome),
        mentor_id = COALESCE(?, mentorId),
        descricao = COALESCE(?, descricao),
        status = COALESCE(?, status),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  return stmt.run(nome, mentorId, descricao, status, id);
}

function addCalouroToGrupo(grupoId, calouroId) {
  const stmt = db.prepare(`
    INSERT INTO calouros_grupos (grupo_id, calouro_id, status)
    VALUES (?, ?, 'ATIVO')
    ON CONFLICT(calouro_id, grupo_id) DO UPDATE SET status = 'ATIVO', data_saida = NULL
  `);
  return stmt.run(grupoId, calouroId);
}

function removeCalouroFromGrupo(grupoId, calouroId) {
  const stmt = db.prepare(`
    DELETE FROM calouros_grupos
    WHERE grupo_id = ? AND calouro_id = ?
  `);
  return stmt.run(grupoId, calouroId);
}

function deleteGrupo(id) {
  db.prepare('DELETE FROM calouros_grupos WHERE grupo_id = ?').run(id);
  db.prepare('DELETE FROM encontros WHERE grupo_id = ?').run(id);
  const stmt = db.prepare('DELETE FROM grupos WHERE id = ?');
  return stmt.run(id);
}

function getGrupoRelatorioFrequencia(grupoId) {
  const grupo = getGrupoById(grupoId);
  if (!grupo) return null;

  const encontrosStmt = db.prepare(`
    SELECT 
      e.id,
      e.titulo,
      e.descricao,
      e.data_hora,
      e.duracao,
      e.local,
      e.status,
      e.tema
    FROM encontros e
    WHERE e.grupo_id = ?
    ORDER BY e.data_hora ASC
  `);
  const encontros = encontrosStmt.all(grupoId);

  const freqMapStmt = db.prepare(`
    SELECT 
      f.encontro_id,
      f.calouro_id,
      f.presente,
      f.observacao
    FROM frequencia f
    JOIN encontros e ON e.id = f.encontro_id
    WHERE e.grupo_id = ?
  `);
  const allFreqs = freqMapStmt.all(grupoId);

  const freqLookup = {};
  for (const f of allFreqs) {
    if (!freqLookup[f.encontro_id]) freqLookup[f.encontro_id] = {};
    freqLookup[f.encontro_id][f.calouro_id] = f.presente;
  }

  const calourosReport = (grupo.calouros || []).map(c => {
    let presencas = 0;
    let totalEncontros = encontros.length;
    encontros.forEach(e => {
      if (freqLookup[e.id] && freqLookup[e.id][c.calouro_id] === 1) {
        presencas++;
      }
    });
    const taxa = totalEncontros > 0 ? Math.round((presencas / totalEncontros) * 100) : 0;
    return {
      calouro_id: c.calouro_id,
      nome: c.nome,
      ra: c.ra,
      email: c.email,
      presencas,
      totalEncontros,
      porcentagemEngajamento: taxa
    };
  });

  const totalEsperadoGeral = calourosReport.length * encontros.length;
  const totalPresencasGeral = calourosReport.reduce((acc, c) => acc + c.presencas, 0);
  const taxaEngajamentoGeral = totalEsperadoGeral > 0 
    ? Math.round((totalPresencasGeral / totalEsperadoGeral) * 100) 
    : 0;

  return {
    grupo: {
      id: grupo.id,
      nome: grupo.nome,
      descricao: grupo.descricao,
      status: grupo.status,
      mentor_nome: grupo.mentor_nome,
      mentor_email: grupo.mentor_email
    },
    totalEncontros: encontros.length,
    encontrosRealizados: encontros.filter(e => e.status === 'REALIZADO' || new Date(e.data_hora) <= new Date()).length,
    totalCalouros: calourosReport.length,
    taxaEngajamentoGeral,
    calouros: calourosReport,
    encontros: encontros.map(e => ({
      id: e.id,
      titulo: e.titulo,
      data_hora: e.data_hora,
      local: e.local,
      status: e.status,
      presentesCount: (grupo.calouros || []).filter(c => freqLookup[e.id] && freqLookup[e.id][c.calouro_id] === 1).length,
      totalEsperado: (grupo.calouros || []).length
    }))
  };
}

function getAllEncontros({ grupoId = null, mentorId = null, calouroId = null } = {}) {
  let query = `
    SELECT 
      e.*,
      g.nome as grupo_nome,
      um.nome_completo as mentor_nome,
      (SELECT COUNT(f.id) FROM frequencia f WHERE f.encontro_id = e.id AND f.presente = 1) as presentes_count,
      (SELECT COUNT(cg.id) FROM calouros_grupos cg WHERE cg.grupo_id = e.grupo_id AND cg.status = 'ATIVO') as total_esperado
    FROM encontros e
    JOIN grupos g ON g.id = e.grupo_id
    LEFT JOIN mentores m ON m.id = g.mentor_id
    LEFT JOIN usuarios um ON um.id = m.usuario_id
    WHERE 1=1
  `;
  const params = [];

  if (grupoId) {
    query += ' AND e.grupo_id = ?';
    params.push(grupoId);
  }
  if (mentorId) {
    query += ' AND g.mentor_id = ?';
    params.push(mentorId);
  }
  if (calouroId) {
    query += ' AND e.grupo_id IN (SELECT grupo_id FROM calouros_grupos WHERE calouro_id = ? AND status = "ATIVO")';
    params.push(calouroId);
  }

  query += ' ORDER BY e.data_hora DESC';
  const stmt = db.prepare(query);
  return stmt.all(...params);
}

function getEncontroById(id) {
  const stmt = db.prepare(`
    SELECT 
      e.*,
      g.nome as grupo_nome,
      um.nome_completo as mentor_nome
    FROM encontros e
    JOIN grupos g ON g.id = e.grupo_id
    LEFT JOIN mentores m ON m.id = g.mentor_id
    LEFT JOIN usuarios um ON um.id = m.usuario_id
    WHERE e.id = ?
  `);
  const encontro = stmt.get(id);
  if (!encontro) return null;

  const freqStmt = db.prepare(`
    SELECT 
      c.id as calouro_id,
      u.nome_completo,
      u.ra,
      COALESCE(f.presente, 0) as presente,
      f.observacao
    FROM calouros_grupos cg
    JOIN calouros c ON c.id = cg.calouro_id
    JOIN usuarios u ON u.id = c.usuario_id
    LEFT JOIN frequencia f ON f.calouro_id = c.id AND f.encontro_id = ?
    WHERE cg.grupo_id = ? AND cg.status = 'ATIVO'
    ORDER BY u.nome_completo
  `);
  encontro.frequencia = freqStmt.all(id, encontro.grupo_id);
  return encontro;
}

function createEncontro({ grupoId, titulo, descricao, dataHora, duracao = 60, local = 'Online', tema = '', criadoPor = null, status = 'AGENDADO' }) {
  const stmt = db.prepare(`
    INSERT INTO encontros (grupo_id, titulo, descricao, data_hora, duracao, local, tema, criado_por, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(grupoId, titulo, descricao, dataHora, duracao, local, tema, criadoPor, status);
}

function updateEncontro(id, { titulo, descricao, dataHora, duracao, local, tema, status }) {
  const stmt = db.prepare(`
    UPDATE encontros
    SET titulo = COALESCE(?, titulo),
        descricao = COALESCE(?, descricao),
        data_hora = COALESCE(?, data_hora),
        duracao = COALESCE(?, duracao),
        local = COALESCE(?, local),
        tema = COALESCE(?, tema),
        status = COALESCE(?, status),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  return stmt.run(titulo, descricao, dataHora, duracao, local, tema, status, id);
}

function deleteEncontro(id) {
  db.prepare('DELETE FROM frequencia WHERE encontro_id = ?').run(id);
  const stmt = db.prepare('DELETE FROM encontros WHERE id = ?');
  return stmt.run(id);
}

function registrarFrequencia(encontroId, calouroId, presente = 1, observacao = '') {
  const stmt = db.prepare(`
    INSERT INTO frequencia (encontro_id, calouro_id, presente, observacao)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(encontro_id, calouro_id) DO UPDATE SET presente = ?, observacao = ?
  `);
  return stmt.run(encontroId, calouroId, presente ? 1 : 0, observacao, presente ? 1 : 0, observacao);
}

function getAllRecursos(tipo = null) {
  if (tipo) {
    const stmt = db.prepare(`
      SELECT r.*, u.nome_completo as autor_nome 
      FROM recursos r 
      LEFT JOIN usuarios u ON u.id = r.criado_por 
      WHERE r.tipo = ? 
      ORDER BY r.created_at DESC
    `);
    return stmt.all(tipo);
  }
  const stmt = db.prepare(`
    SELECT r.*, u.nome_completo as autor_nome 
    FROM recursos r 
    LEFT JOIN usuarios u ON u.id = r.criado_por 
    ORDER BY r.created_at DESC
  `);
  return stmt.all();
}

function createRecurso({ titulo, tipo, descricao, url, criadoPor = null }) {
  const stmt = db.prepare(`
    INSERT INTO recursos (titulo, tipo, descricao, url, criado_por)
    VALUES (?, ?, ?, ?, ?)
  `);
  return stmt.run(titulo, tipo, descricao, url, criadoPor);
}

function deleteRecurso(id) {
  const stmt = db.prepare('DELETE FROM recursos WHERE id = ?');
  return stmt.run(id);
}

function logAtividade({ usuarioId = null, tipo, descricao, dados = null, ip = null }) {
  try {
    const stmt = db.prepare(`
      INSERT INTO atividades (usuario_id, tipo, descricao, dados, ip)
      VALUES (?, ?, ?, ?, ?)
    `);
    return stmt.run(usuarioId, tipo, descricao, dados, ip);
  } catch (err) {}
}

function getAtividadesRecentes(limit = 10) {
  const stmt = db.prepare(`
    SELECT a.*, u.nome_completo as usuario_nome, u.role as usuario_role
    FROM atividades a
    LEFT JOIN usuarios u ON u.id = a.usuario_id
    ORDER BY a.created_at DESC
    LIMIT ?
  `);
  return stmt.all(limit);
}

function getDashboardStats() {
  const totalMentores = db.prepare('SELECT COUNT(*) as count FROM mentores').get().count;
  const mentoresDisponiveis = db.prepare('SELECT COUNT(*) as count FROM mentores WHERE disponivel = 1').get().count;
  const totalCalouros = db.prepare('SELECT COUNT(*) as count FROM calouros').get().count;
  const calourosSemGrupo = db.prepare(`
    SELECT COUNT(*) as count 
    FROM calouros c 
    WHERE c.id NOT IN (SELECT calouro_id FROM calouros_grupos WHERE status = 'ATIVO')
  `).get().count;
  const totalGrupos = db.prepare('SELECT COUNT(*) as count FROM grupos').get().count;
  const gruposAtivos = db.prepare("SELECT COUNT(*) as count FROM grupos WHERE status = 'ATIVO'").get().count;
  const encontrosHoje = db.prepare(`
    SELECT COUNT(*) as count 
    FROM encontros 
    WHERE date(data_hora) = date('now')
  `).get().count;

  const totalEncontrosRealizados = db.prepare("SELECT COUNT(*) as count FROM encontros WHERE status = 'REALIZADO'").get().count;
  const totalEncontros = db.prepare("SELECT COUNT(*) as count FROM encontros").get().count;
  const taxaSucesso = totalEncontros > 0 ? Math.round((totalEncontrosRealizados / totalEncontros) * 100) : 100;

  return {
    totalMentores,
    mentoresDisponiveis,
    totalCalouros,
    calourosSemGrupo,
    totalGrupos,
    gruposAtivos,
    encontrosHoje,
    taxaSucesso
  };
}

module.exports = {
  db,
  initDb,
  getUsuarioByIdentifier,
  getUsuarioByRA,
  getUsuarioByEmail,
  getUsuarioById,
  getAllUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  getAllMentores,
  getMentorById,
  getMentorByUsuarioId,
  createMentor,
  updateMentor,
  deleteMentor,
  getMentorCalouros,
  getAllCalouros,
  getCalouroById,
  getCalouroByUsuarioId,
  createCalouro,
  updateCalouro,
  deleteCalouro,
  getAllGrupos,
  getGrupoById,
  createGrupo,
  updateGrupo,
  addCalouroToGrupo,
  removeCalouroFromGrupo,
  deleteGrupo,
  getAllEncontros,
  getEncontroById,
  createEncontro,
  updateEncontro,
  deleteEncontro,
  registrarFrequencia,
  getAllRecursos,
  createRecurso,
  deleteRecurso,
  logAtividade,
  getAtividadesRecentes,
  getDashboardStats,
  getOrientadorByUsuarioId,
  getGrupoRelatorioFrequencia
};