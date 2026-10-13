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

  const orientadorUserRes = createUsuario({
    nomeUsuario: 'quezia',
    nomeCompleto: 'Quezia',
    email: 'quezia@unicap.br',
    ra: '2011',
    senhaHash,
    role: 'ORIENTADOR',
    ativo: 1
  });

  const usuarioId = orientadorUserRes.lastInsertRowid;

  db.prepare(`
    INSERT INTO orientadores (usuario_id, departamento, cargo)
    VALUES (?, 'Ciência da Computação', 'Orientador Geral')
  `).run(usuarioId);
}

seed().then(() => {
  console.log('Seed executado com sucesso');
}).catch(err => {
  console.error('Erro no seed:', err);
  process.exit(1);
});
