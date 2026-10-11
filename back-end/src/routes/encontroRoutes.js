const express = require('express');
const router = express.Router();
const { 
  getAllEncontros, 
  getEncontroById, 
  createEncontro, 
  updateEncontro, 
  deleteEncontro,
  registrarFrequencia,
  getMentorByUsuarioId,
  getCalouroByUsuarioId,
  logAtividade 
} = require('../database');
const { autenticarToken, autorizarRoles } = require('../middleware/auth');

router.use(autenticarToken);

router.get('/', (req, res) => {
  try {
    let { grupoId, mentorId, calouroId } = req.query;

    if (req.usuario.role === 'MENTOR' && !mentorId && !grupoId) {
      const mentor = getMentorByUsuarioId(req.usuario.id);
      if (mentor) mentorId = mentor.id;
    }

    if (req.usuario.role === 'CALOURO' && !calouroId) {
      const calouro = getCalouroByUsuarioId(req.usuario.id);
      if (calouro) calouroId = calouro.id;
    }

    const encontros = getAllEncontros({ grupoId, mentorId, calouroId });
    res.json(encontros);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar encontros', message: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const encontro = getEncontroById(req.params.id);
    if (!encontro) {
      return res.status(404).json({ error: 'Encontro não encontrado' });
    }
    res.json(encontro);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter encontro', message: error.message });
  }
});

router.post('/', autorizarRoles('ORIENTADOR', 'MENTOR'), (req, res) => {
  try {
    const { grupoId, titulo, descricao, dataHora, duracao = 60, local = 'Online', tema = '' } = req.body;

    if (!grupoId || !titulo || !dataHora) {
      return res.status(400).json({ error: 'Grupo, título e data/hora são obrigatórios' });
    }

    const encontroRes = createEncontro({
      grupoId: Number(grupoId),
      titulo,
      descricao: descricao || '',
      dataHora,
      duracao: Number(duracao) || 60,
      local: local || 'Online',
      tema: tema || '',
      criadoPor: req.usuario.id,
      status: 'AGENDADO'
    });

    logAtividade({
      usuarioId: req.usuario.id,
      tipo: 'ENCONTRO_MARCADO',
      descricao: `Encontro "${titulo}" agendado`
    });

    res.status(201).json({
      success: true,
      id: encontroRes.lastInsertRowid,
      message: 'Encontro agendado com sucesso'
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao agendar encontro', message: error.message });
  }
});

router.put('/:id', autorizarRoles('ORIENTADOR', 'MENTOR'), (req, res) => {
  try {
    const { titulo, descricao, dataHora, duracao, local, tema, status } = req.body;
    updateEncontro(req.params.id, {
      titulo,
      descricao,
      dataHora,
      duracao,
      local,
      tema,
      status
    });

    res.json({ success: true, message: 'Encontro atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar encontro', message: error.message });
  }
});

router.post('/:id/frequencia', autorizarRoles('ORIENTADOR', 'MENTOR'), (req, res) => {
  try {
    const { registros } = req.body;
    if (!Array.isArray(registros)) {
      return res.status(400).json({ error: 'Formato inválido. Registros deve ser um array.' });
    }

    for (const reg of registros) {
      registrarFrequencia(req.params.id, reg.calouroId, reg.presente, reg.observacao || '');
    }

    updateEncontro(req.params.id, { status: 'REALIZADO' });

    res.json({ success: true, message: 'Frequência registrada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar frequência', message: error.message });
  }
});

router.delete('/:id', autorizarRoles('ORIENTADOR', 'MENTOR'), (req, res) => {
  try {
    deleteEncontro(req.params.id);
    res.json({ success: true, message: 'Encontro removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover encontro', message: error.message });
  }
});

module.exports = router;
