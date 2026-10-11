const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { 
  getAllMentores, 
  getMentorById, 
  getMentorByUsuarioId,
  createUsuario,
  createMentor, 
  updateMentor, 
  getMentorCalouros,
  getUsuarioByRA,
  getUsuarioByEmail,
  logAtividade 
} = require('../database');
const { autenticarToken, autorizarRoles } = require('../middleware/auth');

router.use(autenticarToken);

// GET /api/mentores - Listar todos os mentores
router.get('/', (req, res) => {
  try {
    const mentores = getAllMentores();
    res.json(mentores);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar mentores', message: error.message });
  }
});

// GET /api/mentores/meus-calouros - Calouros do mentor autenticado
router.get('/meus-calouros', autorizarRoles('MENTOR'), (req, res) => {
  try {
    const mentor = getMentorByUsuarioId(req.usuario.id);
    if (!mentor) {
      return res.status(404).json({ error: 'Perfil de mentor não encontrado' });
    }
    const calouros = getMentorCalouros(mentor.id);
    res.json({ mentor, calouros });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar calouros do mentor', message: error.message });
  }
});

// GET /api/mentores/:id - Detalhes do mentor
router.get('/:id', (req, res) => {
  try {
    const mentor = getMentorById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor não encontrado' });
    }
    const calouros = getMentorCalouros(mentor.id);
    res.json({ ...mentor, calouros });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter mentor', message: error.message });
  }
});

// POST /api/mentores - Cadastrar novo mentor (Orientador)
router.post('/', autorizarRoles('ORIENTADOR'), (req, res) => {
  try {
    const { nomeCompleto, nomeUsuario, ra, email, senha = '123456', maxCalouros = 5, especialidades = '' } = req.body;

    if (!nomeCompleto || !ra) {
      return res.status(400).json({ error: 'Nome completo e RA são obrigatórios' });
    }

    if (getUsuarioByRA(ra)) {
      return res.status(400).json({ error: 'RA já cadastrado no sistema' });
    }

    const emailCalculado = email || `${ra}@unicap.br`;
    if (getUsuarioByEmail(emailCalculado)) {
      return res.status(400).json({ error: 'E-mail já cadastrado no sistema' });
    }

    const salt = bcrypt.genSaltSync(10);
    const senhaHash = bcrypt.hashSync(senha, salt);

    const userRes = createUsuario({
      nomeUsuario: nomeUsuario || ra,
      nomeCompleto,
      email: emailCalculado,
      ra,
      senhaHash,
      role: 'MENTOR',
      ativo: 1
    });

    const mentorRes = createMentor({
      usuarioId: userRes.lastInsertRowid,
      disponivel: 1,
      maxCalouros: Number(maxCalouros) || 5,
      especialidades
    });

    logAtividade({
      usuarioId: req.usuario.id,
      tipo: 'MENTOR_ADICIONADO',
      descricao: `Novo mentor cadastrado: ${nomeCompleto} por ${req.usuario.nome_completo}`
    });

    res.status(201).json({
      success: true,
      id: mentorRes.lastInsertRowid,
      message: 'Mentor adicionado com sucesso!'
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar mentor', message: error.message });
  }
});

// PUT /api/mentores/:id - Atualizar dados do mentor
router.put('/:id', (req, res) => {
  try {
    const { disponivel, maxCalouros, especialidades } = req.body;
    updateMentor(req.params.id, {
      disponivel: disponivel !== undefined ? (disponivel ? 1 : 0) : undefined,
      maxCalouros,
      especialidades
    });

    res.json({ success: true, message: 'Dados do mentor atualizados com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar mentor', message: error.message });
  }
});

// PATCH /api/mentores/:id/disponibilidade - Alterar disponibilidade
router.patch('/:id/disponibilidade', (req, res) => {
  try {
    const { disponivel } = req.body;
    updateMentor(req.params.id, {
      disponivel: disponivel ? 1 : 0
    });
    res.json({ success: true, disponivel: !!disponivel });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao alterar disponibilidade', message: error.message });
  }
});

module.exports = router;

