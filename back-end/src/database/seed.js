const bcrypt = require('bcryptjs');
const {
  db,
  initDb,
  createUsuario
} = require('./index');

async function seed() {
  initDb();

  db.exec(`
    DELETE FROM frequencia;
    DELETE FROM feedbacks;
    DELETE FROM mensagens;
    DELETE FROM encontros_calouros;
    DELETE FROM encontros;
    DELETE FROM calouros_grupos;
    DELETE FROM grupos;
    DELETE FROM calouros;
    DELETE FROM mentores;
    DELETE FROM administradores;
    DELETE FROM orientadores;
    DELETE FROM atividades;
    DELETE FROM recursos;
    DELETE FROM usuarios;
  `);

  const salt = bcrypt.genSaltSync(10);
  const senhaHash = bcrypt.hashSync('2011', salt);

  const adminUserRes = createUsuario({
    nomeUsuario: 'quezia',
    nomeCompleto: 'Quezia',
    email: 'quezia@unicap.br',
    ra: '2011',
    senhaHash,
    role: 'ADMINISTRADOR',
    ativo: 1
  });

  const usuarioId = adminUserRes.lastInsertRowid;

  db.prepare(`
    INSERT INTO administradores (usuario_id, departamento, cargo)
    VALUES (?, 'Ciência da Computação', 'Administrador Geral')
  `).run(usuarioId);

  db.prepare(`
    INSERT INTO orientadores (usuario_id, departamento, cargo)
    VALUES (?, 'Ciência da Computação', 'Orientador / Administrador')
  `).run(usuarioId);
}

seed().then(() => {
  console.log('Seed executado com sucesso');
}).catch(err => {
  console.error('Erro no seed:', err);
  process.exit(1);
});
