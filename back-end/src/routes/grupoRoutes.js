const express = require('express');
const router = express.Router();
const { 
  getAllGrupos, 
  getGrupoById, 
  createGrupo, 
  updateGrupo, 
  addCalouroToGrupo, 
  removeCalouroFromGrupo, 
  deleteGrupo,
  logAtividade 
} = require('../database');
const { autenticarToken, autorizarRoles } = require('../middleware/auth');

router.use(autenticarToken);

router.get('/', (req, res) => {
  try {
    const grupos = getAllGrupos();
    res.json(grupos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar grupos', message: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const grupo = getGrupoById(req.params.id);
    if (!grupo) {
      return res.status(404).json({ error: 'Grupo não encontrado' });
    }
    res.json(grupo);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter grupo', message: error.message });
  }
});

router.post('/', autorizarRoles('ORIENTADOR'), (req, res) => {
  try {
    const { nome, mentorId, descricao, calouroIds = [] } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'O nome do grupo é obrigatório' });
    }

    const grupoRes = createGrupo({
      nome,
      mentorId: mentorId ? Number(mentorId) : null,
      orientadorId: req.usuario.id,
      descricao: descricao || '',
      status: 'ATIVO'
    });

    const grupoId = grupoRes.lastInsertRowid;

    if (Array.isArray(calouroIds) && calouroIds.length > 0) {
      for (const cId of calouroIds) {
        addCalouroToGrupo(grupoId, Number(cId));
      }
    }

    logAtividade({
      usuarioId: req.usuario.id,
      tipo: 'GRUPO_CRIADO',
      descricao: `Grupo "${nome}" criado`
    });

    res.status(201).json({
      success: true,
      id: grupoId,
      message: 'Grupo criado com sucesso'
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar grupo', message: error.message });
  }
});

router.put('/:id', autorizarRoles('ORIENTADOR', 'MENTOR'), (req, res) => {
  try {
    const { nome, mentorId, descricao, status } = req.body;
    updateGrupo(req.params.id, {
      nome,
      mentorId: mentorId ? Number(mentorId) : undefined,
      descricao,
      status
    });

    res.json({ success: true, message: 'Grupo atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar grupo', message: error.message });
  }
});

router.post('/:id/calouros', autorizarRoles('ORIENTADOR'), (req, res) => {
  try {
    const { calouroId } = req.body;
    if (!calouroId) {
      return res.status(400).json({ error: 'ID do calouro é obrigatório' });
    }

    addCalouroToGrupo(req.params.id, Number(calouroId));
    res.json({ success: true, message: 'Calouro adicionado ao grupo com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar calouro ao grupo', message: error.message });
  }
});

router.delete('/:id/calouros/:calouroId', autorizarRoles('ORIENTADOR'), (req, res) => {
  try {
    removeCalouroFromGrupo(req.params.id, req.params.calouroId);
    res.json({ success: true, message: 'Calouro removido do grupo com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover calouro do grupo', message: error.message });
  }
});

router.delete('/:id', autorizarRoles('ORIENTADOR'), (req, res) => {
  try {
    deleteGrupo(req.params.id);
    logAtividade({
      usuarioId: req.usuario.id,
      tipo: 'GRUPO_REMOVIDO',
      descricao: `Grupo ID ${req.params.id} excluído`
    });
    res.json({ success: true, message: 'Grupo excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir grupo', message: error.message });
  }
});

module.exports = router;
