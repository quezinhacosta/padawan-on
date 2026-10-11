const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getAtividadesRecentes, 
  getAllEncontros, 
  getMentorByUsuarioId,
  getMentorCalouros,
  getCalouroByUsuarioId
} = require('../database');
const { autenticarToken } = require('../middleware/auth');

router.use(autenticarToken);

router.get('/stats', (req, res) => {
  try {
    const stats = getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter estatísticas', message: error.message });
  }
});

router.get('/atividades', (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const atividades = getAtividadesRecentes(limit);
    res.json(atividades);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter atividades recentes', message: error.message });
  }
});

router.get('/mentor-resumo', (req, res) => {
  try {
    const mentor = getMentorByUsuarioId(req.usuario.id);
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor não encontrado' });
    }

    const calouros = getMentorCalouros(mentor.id);
    const encontros = getAllEncontros({ mentorId: mentor.id });

    const encontrosAgendados = encontros.filter(e => e.status === 'AGENDADO');
    const encontrosRealizados = encontros.filter(e => e.status === 'REALIZADO');

    res.json({
      mentor,
      totalCalouros: calouros.length,
      maxCalouros: mentor.max_calouros,
      disponivel: !!mentor.disponivel,
      encontrosAgendadosCount: encontrosAgendados.length,
      encontrosRealizadosCount: encontrosRealizados.length,
      proximosEncontros: encontrosAgendados.slice(0, 5),
      calouros
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter resumo do mentor', message: error.message });
  }
});

router.get('/calouro-resumo', (req, res) => {
  try {
    const calouro = getCalouroByUsuarioId(req.usuario.id);
    if (!calouro) {
      return res.status(404).json({ error: 'Calouro não encontrado' });
    }

    const encontros = getAllEncontros({ calouroId: calouro.id });
    const encontrosAgendados = encontros.filter(e => e.status === 'AGENDADO');
    const encontrosRealizados = encontros.filter(e => e.status === 'REALIZADO');

    res.json({
      calouro,
      mentor: calouro.mentor_nome ? {
        nome: calouro.mentor_nome,
        email: calouro.mentor_email,
        disponivel: !!calouro.mentor_disponivel
      } : null,
      grupoNome: calouro.grupo_nome,
      encontrosCount: encontros.length,
      encontrosRealizadosCount: encontrosRealizados.length,
      proximosEncontros: encontrosAgendados.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter resumo do calouro', message: error.message });
  }
});

module.exports = router;
