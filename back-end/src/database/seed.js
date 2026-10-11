const bcrypt = require('bcryptjs');
const {
  db,
  initDb,
  createUsuario,
  createMentor,
  createCalouro,
  createGrupo,
  addCalouroToGrupo,
  createEncontro,
  registrarFrequencia,
  createRecurso,
  logAtividade
} = require('./index');

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados SGA / Padawan ON...');

  // Garantir schema
  initDb();

  // Limpar tabelas existentes
  db.exec(`
    DELETE FROM frequencia;
    DELETE FROM encontros;
    DELETE FROM calouros_grupos;
    DELETE FROM grupos;
    DELETE FROM calouros;
    DELETE FROM mentores;
    DELETE FROM orientadores;
    DELETE FROM atividades;
    DELETE FROM recursos;
    DELETE FROM usuarios;
  `);

  const salt = bcrypt.genSaltSync(10);
  const senhaPadrao = '123456';
  const senhaHash = bcrypt.hashSync(senhaPadrao, salt);

  // 1. Orientador
  const orientadorUserRes = createUsuario({
    nomeUsuario: 'ricardo.orientador',
    nomeCompleto: 'Prof. Dr. Ricardo Silva',
    email: 'ricardo.silva@unicap.br',
    ra: '1001',
    senhaHash,
    role: 'ORIENTADOR',
    ativo: 1
  });
  const orientadorUserId = orientadorUserRes.lastInsertRowid;
  db.prepare(`
    INSERT INTO orientadores (usuario_id, departamento, cargo)
    VALUES (?, 'Ciência da Computação', 'Coordenador de Extensão')
  `).run(orientadorUserId);

  // 2. Mentores
  const mentoresData = [
    {
      nomeUsuario: 'lucas.mentor',
      nomeCompleto: 'Lucas Mendes',
      email: 'lucas.mendes@unicap.br',
      ra: '2001',
      especialidades: 'Python, Algoritmos, Desenvolvimento Web',
      maxCalouros: 5,
      disponivel: 1
    },
    {
      nomeUsuario: 'camila.mentor',
      nomeCompleto: 'Camila Rocha',
      email: 'camila.rocha@unicap.br',
      ra: '2002',
      especialidades: 'Java, POO, Estruturas de Dados',
      maxCalouros: 4,
      disponivel: 1
    },
    {
      nomeUsuario: 'bruno.mentor',
      nomeCompleto: 'Bruno Henrique',
      email: 'bruno.henrique@unicap.br',
      ra: '2003',
      especialidades: 'Banco de Dados, SQL, Git & GitHub',
      maxCalouros: 5,
      disponivel: 0
    }
  ];

  const mentorIds = [];
  for (const m of mentoresData) {
    const uRes = createUsuario({
      nomeUsuario: m.nomeUsuario,
      nomeCompleto: m.nomeCompleto,
      email: m.email,
      ra: m.ra,
      senhaHash,
      role: 'MENTOR',
      ativo: 1
    });
    const mRes = createMentor({
      usuarioId: uRes.lastInsertRowid,
      disponivel: m.disponivel,
      maxCalouros: m.maxCalouros,
      especialidades: m.especialidades
    });
    mentorIds.push(mRes.lastInsertRowid);
  }

  // 3. Calouros
  const calourosData = [
    {
      nomeUsuario: 'pedro.calouro',
      nomeCompleto: 'Pedro Alves',
      email: 'pedro.alves@unicap.br',
      ra: '3001'
    },
    {
      nomeUsuario: 'beatriz.calouro',
      nomeCompleto: 'Beatriz Lima',
      email: 'beatriz.lima@unicap.br',
      ra: '3002'
    },
    {
      nomeUsuario: 'gabriel.calouro',
      nomeCompleto: 'Gabriel Costa',
      email: 'gabriel.costa@unicap.br',
      ra: '3003'
    },
    {
      nomeUsuario: 'juliana.calouro',
      nomeCompleto: 'Juliana Ramos',
      email: 'juliana.ramos@unicap.br',
      ra: '3004'
    },
    {
      nomeUsuario: 'thiago.calouro',
      nomeCompleto: 'Thiago Moreira',
      email: 'thiago.moreira@unicap.br',
      ra: '3005'
    }
  ];

  const calouroIds = [];
  for (const c of calourosData) {
    const uRes = createUsuario({
      nomeUsuario: c.nomeUsuario,
      nomeCompleto: c.nomeCompleto,
      email: c.email,
      ra: c.ra,
      senhaHash,
      role: 'CALOURO',
      ativo: 1
    });
    const cRes = createCalouro({
      usuarioId: uRes.lastInsertRowid,
      curso: 'Ciência da Computação',
      periodo: '1º Período'
    });
    calouroIds.push(cRes.lastInsertRowid);
  }

  // 4. Grupos de Mentoria
  const g1Res = createGrupo({
    nome: 'Grupo Ada Lovelace',
    mentorId: mentorIds[0], // Lucas Mendes
    orientadorId: orientadorUserId,
    descricao: 'Grupo focado em fundamentos de programação, lógica e adaptação ao 1º período.',
    status: 'ATIVO'
  });
  const g1Id = g1Res.lastInsertRowid;
  addCalouroToGrupo(g1Id, calouroIds[0]); // Pedro Alves
  addCalouroToGrupo(g1Id, calouroIds[1]); // Beatriz Lima

  const g2Res = createGrupo({
    nome: 'Grupo Alan Turing',
    mentorId: mentorIds[1], // Camila Rocha
    orientadorId: orientadorUserId,
    descricao: 'Grupo com ênfase em resolução de problemas, algoritmos e boas práticas de estudo.',
    status: 'ATIVO'
  });
  const g2Id = g2Res.lastInsertRowid;
  addCalouroToGrupo(g2Id, calouroIds[2]); // Gabriel Costa
  addCalouroToGrupo(g2Id, calouroIds[3]); // Juliana Ramos

  // (Calouro calouroIds[4] Thiago Moreira fica sem grupo para testar atribuição!)

  // 5. Encontros
  // Encontro 1 (Passado / Realizado)
  const e1Res = createEncontro({
    grupoId: g1Id,
    titulo: 'Acolhimento e Visão Geral do Curso',
    descricao: 'Recepção dos calouros, apresentação da matriz curricular e tira-dúvidas sobre o semestre.',
    dataHora: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    duracao: 60,
    local: 'Sala 302 - Bloco G / Google Meet',
    tema: 'Introdução à Vida Acadêmica',
    criadoPor: orientadorUserId,
    status: 'REALIZADO'
  });
  const e1Id = e1Res.lastInsertRowid;
  registrarFrequencia(e1Id, calouroIds[0], 1, 'Participou ativamente');
  registrarFrequencia(e1Id, calouroIds[1], 1, 'Presente e pontual');

  // Encontro 2 (Futuro / Agendado)
  const e2Res = createEncontro({
    grupoId: g1Id,
    titulo: 'Desvendando Lógica de Programação & Python',
    descricao: 'Prática de estruturas condicionais e de repetição usando exemplos do cotidiano.',
    dataHora: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    duracao: 90,
    local: 'Laboratório de Informática 3 / Bloco A',
    tema: 'Lógica e Algoritmos',
    criadoPor: orientadorUserId,
    status: 'AGENDADO'
  });

  // Encontro 3 (Agendado Grupo 2)
  createEncontro({
    grupoId: g2Id,
    titulo: 'Técnicas de Estudo e Preparação para Provas',
    descricao: 'Dicas sobre como estudar programação, mapas mentais e organização de rotina.',
    dataHora: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    duracao: 60,
    local: 'Auditório 1 - Bloco B',
    tema: 'Metodologia e Organização',
    criadoPor: orientadorUserId,
    status: 'AGENDADO'
  });

  // 6. Recursos Educacionais
  createRecurso({
    titulo: 'Guia do Calouro de Ciência da Computação UNICAP',
    tipo: 'DOCUMENTO',
    descricao: 'Tudo o que você precisa saber sobre matriz curricular, laboratórios, bibliotecas e horários.',
    url: 'https://portal.unicap.br/computacao',
    criadoPor: orientadorUserId
  });

  createRecurso({
    titulo: 'Minicurso: Dominando Git e GitHub do Zero',
    tipo: 'VIDEO',
    descricao: 'Aprenda versionamento de código essencial para os projetos do curso.',
    url: 'https://youtube.com',
    criadoPor: orientadorUserId
  });

  createRecurso({
    titulo: 'Lista de Exercícios Práticos - Algoritmos',
    tipo: 'EXERCICIO',
    descricao: '20 exercícios graduais com gabarito comentado para praticar lógica e laços de repetição.',
    url: 'https://github.com',
    criadoPor: orientadorUserId
  });

  createRecurso({
    titulo: 'Documentação Oficial da Linguagem Python 3',
    tipo: 'LINK',
    descricao: 'Referência rápida e tutorial oficial para consultas durante a disciplina de Introdução.',
    url: 'https://docs.python.org/3/tutorial/',
    criadoPor: orientadorUserId
  });

  // 7. Atividades Recentes
  logAtividade({
    usuarioId: orientadorUserId,
    tipo: 'GRUPO_CRIADO',
    descricao: 'Novo grupo "Grupo Ada Lovelace" formado com o mentor Lucas Mendes e 2 calouros.'
  });

  logAtividade({
    usuarioId: orientadorUserId,
    tipo: 'MENTOR_ADICIONADO',
    descricao: 'Mentor Lucas Mendes foi vinculado ao programa de apadrinhamento.'
  });

  logAtividade({
    usuarioId: orientadorUserId,
    tipo: 'ENCONTRO_MARCADO',
    descricao: 'Encontro "Desvendando Lógica de Programação & Python" agendado.'
  });

  logAtividade({
    usuarioId: orientadorUserId,
    tipo: 'CALOURO_ADICIONADO',
    descricao: 'Calouro Thiago Moreira registrado na plataforma.'
  });

  console.log('✅ Seed finalizado com sucesso!');
  console.log('--------------------------------------------------');
  console.log('Credenciais disponíveis para teste (senha padrão: 123456):');
  console.log('👨‍🏫 Orientador: RA 1001 (Prof. Dr. Ricardo Silva)');
  console.log('🧑‍🎓 Mentor:     RA 2001 (Lucas Mendes) ou 2002 (Camila Rocha)');
  console.log('👶 Calouro:    RA 3001 (Pedro Alves) ou 3005 (Thiago Moreira - sem grupo)');
  console.log('--------------------------------------------------');
}

seed().catch(err => {
  console.error('❌ Erro no seed:', err);
  process.exit(1);
});

