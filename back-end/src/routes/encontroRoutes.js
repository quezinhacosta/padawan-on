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
  responderConviteEncontro,
  getEncontroCalourosRespostas,
  createFeedback,
  getFeedbacksByEncontro,
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
    const respostas = getEncontroCalourosRespostas(req.params.id);
    const feedbacks = getFeedbacksByEncontro(req.params.id);
    res.json({
      ...encontro,
      respostas_convites: respostas,
      feedbacks
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter encontro', message: error.message });
  }
});

router.post('/', autorizarRoles('ORIENTADOR', 'ADMINISTRADOR', 'MENTOR'), (req, res) => {
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

router.put('/:id', autorizarRoles('ORIENTADOR', 'ADMINISTRADOR', 'MENTOR'), (req, res) => {
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

router.post('/:id/frequencia', autorizarRoles('ORIENTADOR', 'ADMINISTRADOR', 'MENTOR'), (req, res) => {
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

router.post('/:id/resposta', autorizarRoles('CALOURO'), (req, res) => {
  try {
    const calouro = getCalouroByUsuarioId(req.usuario.id);
    if (!calouro) {
      return res.status(404).json({ error: 'Perfil de calouro não encontrado' });
    }

    const { status } = req.body;
    const statusNormalizado = (status || '').toUpperCase().trim();
    if (!['ACEITO', 'RECUSADO'].includes(statusNormalizado)) {
      return res.status(400).json({ error: 'Status deve ser ACEITO ou RECUSADO' });
    }

    responderConviteEncontro(req.params.id, calouro.id, statusNormalizado);

    logAtividade({
      usuarioId: req.usuario.id,
      tipo: 'CONVITE_RESPONDIDO',
      descricao: `Calouro ${req.usuario.nome_completo} marcou convite como ${statusNormalizado}`
    });

    res.json({ success: true, message: `Convite atualizado para ${statusNormalizado}` });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao responder convite de encontro', message: error.message });
  }
});

router.get('/:id/respostas', (req, res) => {
  try {
    const respostas = getEncontroCalourosRespostas(req.params.id);
    res.json(respostas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar respostas de convite', message: error.message });
  }
});

router.post('/:id/feedback', (req, res) => {
  try {
    const { destinatarioId, tipo = 'GERAL', nota, comentario } = req.body;

    if (!comentario || comentario.trim() === '') {
      return res.status(400).json({ error: 'Comentário de feedback é obrigatório' });
    }

    createFeedback({
      encontroId: req.params.id,
      autorId: req.usuario.id,
      destinatarioId: destinatarioId || null,
      tipo,
      nota: nota ? Number(nota) : null,
      comentario: comentario.trim()
    });

    logAtividade({
      usuarioId: req.usuario.id,
      tipo: 'FEEDBACK_ENVIADO',
      descricao: `Feedback enviado por ${req.usuario.nome_completo} para encontro ID ${req.params.id}`
    });

    res.status(201).json({ success: true, message: 'Feedback enviado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar feedback', message: error.message });
  }
});

router.get('/:id/feedbacks', (req, res) => {
  try {
    const feedbacks = getFeedbacksByEncontro(req.params.id);
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar feedbacks do encontro', message: error.message });
  }
});

router.delete('/:id', autorizarRoles('ORIENTADOR', 'ADMINISTRADOR', 'MENTOR'), (req, res) => {
  try {
    deleteEncontro(req.params.id);
    res.json({ success: true, message: 'Encontro removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover encontro', message: error.message });
  }
});

module.exports = router;
