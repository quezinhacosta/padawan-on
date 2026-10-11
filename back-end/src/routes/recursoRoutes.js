const express = require('express');
const router = express.Router();
const { 
  getAllRecursos, 
  createRecurso, 
  deleteRecurso,
  logAtividade 
} = require('../database');
const { autenticarToken, autorizarRoles } = require('../middleware/auth');

router.use(autenticarToken);

// GET /api/recursos - Listar recursos
router.get('/', (req, res) => {
  try {
    const { tipo } = req.query;
    const recursos = getAllRecursos(tipo);
    res.json(recursos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar recursos', message: error.message });
  }
});

// POST /api/recursos - Criar recurso (Orientador ou Mentor)
router.post('/', autorizarRoles('ORIENTADOR', 'MENTOR'), (req, res) => {
  try {
    const { titulo, tipo, descricao, url } = req.body;

    if (!titulo || !tipo || !url) {
      return res.status(400).json({ error: 'Título, tipo e URL são obrigatórios' });
    }

    const recursoRes = createRecurso({
      titulo,
      tipo,
      descricao: descricao || '',
      url,
      criadoPor: req.usuario.id
    });

    logAtividade({
      usuarioId: req.usuario.id,
      tipo: 'RECURSO_ADICIONADO',
      descricao: `Novo recurso educacional adicionado: "${titulo}" por ${req.usuario.nome_completo}`
    });

    res.status(201).json({
      success: true,
      id: recursoRes.lastInsertRowid,
      message: 'Recurso adicionado com sucesso!'
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar recurso', message: error.message });
  }
});

// DELETE /api/recursos/:id - Remover recurso
router.delete('/:id', autorizarRoles('ORIENTADOR'), (req, res) => {
  try {
    deleteRecurso(req.params.id);
    res.json({ success: true, message: 'Recurso excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir recurso', message: error.message });
  }
});

module.exports = router;

