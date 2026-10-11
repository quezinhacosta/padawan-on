const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { 
  getAllCalouros, 
  getCalouroById, 
  getCalouroByUsuarioId,
  createUsuario,
  createCalouro, 
  updateCalouro,
  deleteCalouro,
  getUsuarioByRA,
  getUsuarioByEmail,
  logAtividade 
} = require('../database');
const { autenticarToken, autorizarRoles } = require('../middleware/auth');

router.use(autenticarToken);

router.get('/', (req, res) => {
  try {
    const calouros = getAllCalouros();
    res.json(calouros);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar calouros', message: error.message });
  }
});

router.get('/meu-perfil', autorizarRoles('CALOURO'), (req, res) => {
  try {
    const calouro = getCalouroByUsuarioId(req.usuario.id);
    if (!calouro) {
      return res.status(404).json({ error: 'Perfil de calouro não encontrado' });
    }
    res.json(calouro);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter perfil do calouro', message: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const calouro = getCalouroById(req.params.id);
    if (!calouro) {
      return res.status(404).json({ error: 'Calouro não encontrado' });
    }
    res.json(calouro);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter calouro', message: error.message });
  }
});

router.post('/', autorizarRoles('ORIENTADOR'), (req, res) => {
  try {
    const { nomeCompleto, nomeUsuario, ra, email, senha = '123456', curso = 'Ciência da Computação', periodo = '1º Período' } = req.body;

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
      role: 'CALOURO',
      ativo: 1
    });

    const calouroRes = createCalouro({
      usuarioId: userRes.lastInsertRowid,
      curso,
      periodo
    });

    logAtividade({
      usuarioId: req.usuario.id,
      tipo: 'CALOURO_ADICIONADO',
      descricao: `Novo calouro adicionado: ${nomeCompleto}`
    });

    res.status(201).json({
      success: true,
      id: calouroRes.lastInsertRowid,
      message: 'Calouro cadastrado com sucesso'
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar calouro', message: error.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { curso, periodo } = req.body;
    updateCalouro(req.params.id, { curso, periodo });
    res.json({ success: true, message: 'Dados do calouro atualizados com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar calouro', message: error.message });
  }
});

router.delete('/:id', autorizarRoles('ORIENTADOR'), (req, res) => {
  try {
    deleteCalouro(req.params.id);
    logAtividade({
      usuarioId: req.usuario.id,
      tipo: 'CALOURO_REMOVIDO',
      descricao: `Calouro ID ${req.params.id} removido`
    });
    res.json({ success: true, message: 'Calouro excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir calouro', message: error.message });
  }
});

module.exports = router;
