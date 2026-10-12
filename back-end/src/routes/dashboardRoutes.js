const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getAtividadesRecentes,
  getAtividadesByGrupo,
  getAllEncontros, 
  getAllGrupos,
  getGrupoById,
  getMentorByUsuarioId,
  getMentorCalouros,
  getCalouroByUsuarioId,
  getAdministradorByUsuarioId
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
    const { grupoId } = req.query;

    if (grupoId) {
      const atividades = getAtividadesByGrupo(Number(grupoId), limit);
      return res.json(atividades);
    }

    if (req.usuario.role === 'MENTOR') {
      const mentor = getMentorByUsuarioId(req.usuario.id);
      if (mentor) {
        const grupos = getAllGrupos({ mentorId: mentor.id });
        if (grupos.length > 0) {
          const atividades = getAtividadesByGrupo(grupos[0].id, limit);
          return res.json(atividades);
        }
      }
      return res.json([]);
    }

    if (req.usuario.role === 'ADMINISTRADOR') {
      const admin = getAdministradorByUsuarioId(req.usuario.id);
      if (admin) {
        const grupos = getAllGrupos({ adminId: admin.id });
        if (grupos.length > 0) {
          const atividades = getAtividadesByGrupo(grupos[0].id, limit);
          return res.json(atividades);
        }
      }
      return res.json([]);
    }

    const atividades = getAtividadesRecentes(limit);
    res.json(atividades);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter atividades', message: error.message });
  }
});

router.get('/mentor-resumo', (req, res) => {
  try {
    const mentor = getMentorByUsuarioId(req.usuario.id);
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor não encontrado' });
    }

    const grupos = getAllGrupos({ mentorId: mentor.id });
    const grupo = grupos.length > 0 ? grupos[0] : null;

    const calouros = getMentorCalouros(mentor.id);
    const encontros = getAllEncontros({ mentorId: mentor.id });

    const encontrosAgendados = encontros.filter(e => e.status === 'AGENDADO');
    const encontrosRealizados = encontros.filter(e => e.status === 'REALIZADO');
    const atividades = grupo ? getAtividadesByGrupo(grupo.id, 8) : [];

    res.json({
      mentor,
      grupo,
      totalCalouros: calouros.length,
      maxCalouros: mentor.max_calouros,
      disponivel: !!mentor.disponivel,
      encontrosAgendadosCount: encontrosAgendados.length,
      encontrosRealizadosCount: encontrosRealizados.length,
      proximosEncontros: encontrosAgendados.slice(0, 5),
      calouros,
      movimentacoes: atividades
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
        id: calouro.mentor_id,
        usuarioId: calouro.mentor_usuario_id,
        nome: calouro.mentor_nome,
        email: calouro.mentor_email,
        disponivel: !!calouro.mentor_disponivel
      } : null,
      grupoId: calouro.grupo_id,
      grupoNome: calouro.grupo_nome,
      encontrosCount: encontros.length,
      encontrosRealizadosCount: encontrosRealizados.length,
      proximosEncontros: encontrosAgendados.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter resumo do calouro', message: error.message });
  }
});

router.get('/admin-resumo', (req, res) => {
  try {
    const admin = getAdministradorByUsuarioId(req.usuario.id);
    const grupos = getAllGrupos({ adminId: admin ? admin.id : req.usuario.id });
    const grupo = grupos.length > 0 ? grupos[0] : null;

    let calouros = [];
    let encontros = [];
    let movimentacoes = [];

    if (grupo) {
      calouros = grupo.calouros || [];
      encontros = getAllEncontros({ grupoId: grupo.id });
      movimentacoes = getAtividadesByGrupo(grupo.id, 10);
    }

    res.json({
      admin,
      grupos,
      grupoAtivo: grupo,
      totalCalouros: calouros.length,
      totalEncontros: encontros.length,
      encontrosAgendados: encontros.filter(e => e.status === 'AGENDADO'),
      encontrosRealizados: encontros.filter(e => e.status === 'REALIZADO'),
      calouros,
      movimentacoes
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter resumo do administrador', message: error.message });
  }
});

module.exports = router;
