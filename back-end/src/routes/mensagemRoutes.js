const express = require('express');
const router = express.Router();
const { 
  createMensagem, 
  getMensagensByGrupo, 
  getMensagensEntreUsuarios,
  logAtividade 
} = require('../database');
const { autenticarToken } = require('../middleware/auth');

router.use(autenticarToken);

router.get('/', (req, res) => {
  try {
    const { grupoId, destinatarioId } = req.query;

    if (grupoId) {
      const mensagens = getMensagensByGrupo(Number(grupoId));
      return res.json(mensagens);
    }

    if (destinatarioId) {
      const mensagens = getMensagensEntreUsuarios(req.usuario.id, Number(destinatarioId));
      return res.json(mensagens);
    }

    res.status(400).json({ error: 'Informe grupoId ou destinatarioId' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar mensagens', message: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { grupoId, destinatarioId, conteudo, tipo = 'CHAT' } = req.body;

    if (!destinatarioId || !conteudo || !conteudo.trim()) {
      return res.status(400).json({ error: 'Destinatário e conteúdo são obrigatórios' });
    }

    const mensagemRes = createMensagem({
      grupoId: grupoId ? Number(grupoId) : null,
      remetenteId: req.usuario.id,
      destinatarioId: Number(destinatarioId),
      conteudo: conteudo.trim(),
      tipo
    });

    logAtividade({
      usuarioId: req.usuario.id,
      tipo: 'MENSAGEM_ENVIADA',
      descricao: `Mensagem enviada para usuário ID ${destinatarioId}`
    });

    res.status(201).json({
      success: true,
      id: mensagemRes.lastInsertRowid,
      message: 'Mensagem enviada com sucesso'
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao enviar mensagem', message: error.message });
  }
});

module.exports = router;

