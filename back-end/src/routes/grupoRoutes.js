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
  getGrupoRelatorioFrequencia,
  getAdministradorByUsuarioId,
  logAtividade 
} = require('../database');
const { autenticarToken, autorizarRoles } = require('../middleware/auth');

router.use(autenticarToken);

router.get('/', (req, res) => {
  try {
    let grupos;
    if (req.usuario.role === 'ADMINISTRADOR') {
      const adminObj = getAdministradorByUsuarioId(req.usuario.id);
      grupos = getAllGrupos({ adminId: adminObj ? adminObj.id : req.usuario.id });
    } else if (req.usuario.role === 'MENTOR') {
      grupos = getAllGrupos({ mentorId: req.usuario.id });
    } else {
      grupos = getAllGrupos();
    }
    res.json(grupos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar grupos', message: error.message });
  }
});

router.get('/:id/relatorio-frequencia', (req, res) => {
  try {
    const g = getGrupoById(req.params.id);
    if (!g) {
      return res.status(404).json({ error: 'Grupo não encontrado' });
    }

    if (req.usuario.role === 'ADMINISTRADOR') {
      const adminObj = getAdministradorByUsuarioId(req.usuario.id);
      const isOwner = (g.admin_id && ((adminObj && g.admin_id === adminObj.id) || g.admin_id === req.usuario.id));
      if (!isOwner) {
        return res.status(403).json({ error: 'Acesso negado aos relatórios deste grupo' });
      }
    }

    const relatorio = getGrupoRelatorioFrequencia(req.params.id);
    res.json(relatorio);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar relatório do grupo', message: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const grupo = getGrupoById(req.params.id);
    if (!grupo) {
      return res.status(404).json({ error: 'Grupo não encontrado' });
    }
    if (req.usuario.role === 'ADMINISTRADOR') {
      const adminObj = getAdministradorByUsuarioId(req.usuario.id);
      const isOwner = (grupo.admin_id && ((adminObj && grupo.admin_id === adminObj.id) || grupo.admin_id === req.usuario.id));
      if (!isOwner) {
        return res.status(403).json({ error: 'Acesso restrito ao grupo atribuído' });
      }
    }
    res.json(grupo);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter grupo', message: error.message });
  }
});

router.post('/', autorizarRoles('ORIENTADOR', 'ADMINISTRADOR'), (req, res) => {
  try {
    const { nome, mentorId, adminId, descricao, calouroIds = [] } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'O nome do grupo é obrigatório' });
    }

    const effectiveAdminId = req.usuario.role === 'ADMINISTRADOR' ? req.usuario.id : (adminId || null);
    const effectiveOrientadorId = req.usuario.role === 'ORIENTADOR' ? req.usuario.id : null;

    const grupoRes = createGrupo({
      nome,
      mentorId: mentorId ? Number(mentorId) : null,
      orientadorId: effectiveOrientadorId,
      adminId: effectiveAdminId,
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

router.put('/:id', autorizarRoles('ORIENTADOR', 'ADMINISTRADOR'), (req, res) => {
  try {
    const g = getGrupoById(req.params.id);
    if (!g) {
      return res.status(404).json({ error: 'Grupo não encontrado' });
    }

    if (req.usuario.role === 'ADMINISTRADOR') {
      const adminObj = getAdministradorByUsuarioId(req.usuario.id);
      const isOwner = (g.admin_id && ((adminObj && g.admin_id === adminObj.id) || g.admin_id === req.usuario.id));
      if (!isOwner) {
        return res.status(403).json({ error: 'Acesso negado para gerenciar este grupo' });
      }
    }

    const { nome, mentorId, adminId, descricao, status } = req.body;
    updateGrupo(req.params.id, {
      nome,
      mentorId: mentorId ? Number(mentorId) : undefined,
      adminId: adminId ? Number(adminId) : undefined,
      descricao,
      status
    });

    res.json({ success: true, message: 'Grupo atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar grupo', message: error.message });
  }
});

router.post('/:id/calouros', autorizarRoles('ORIENTADOR', 'ADMINISTRADOR'), (req, res) => {
  try {
    const g = getGrupoById(req.params.id);
    if (!g) {
      return res.status(404).json({ error: 'Grupo não encontrado' });
    }

    if (req.usuario.role === 'ADMINISTRADOR') {
      const adminObj = getAdministradorByUsuarioId(req.usuario.id);
      const isOwner = (g.admin_id && ((adminObj && g.admin_id === adminObj.id) || g.admin_id === req.usuario.id));
      if (!isOwner) {
        return res.status(403).json({ error: 'Acesso negado para alterar este grupo' });
      }
    }

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

router.delete('/:id/calouros/:calouroId', autorizarRoles('ORIENTADOR', 'ADMINISTRADOR'), (req, res) => {
  try {
    const g = getGrupoById(req.params.id);
    if (!g) {
      return res.status(404).json({ error: 'Grupo não encontrado' });
    }

    if (req.usuario.role === 'ADMINISTRADOR') {
      const adminObj = getAdministradorByUsuarioId(req.usuario.id);
      const isOwner = (g.admin_id && ((adminObj && g.admin_id === adminObj.id) || g.admin_id === req.usuario.id));
      if (!isOwner) {
        return res.status(403).json({ error: 'Acesso negado para alterar este grupo' });
      }
    }

    removeCalouroFromGrupo(req.params.id, req.params.calouroId);
    res.json({ success: true, message: 'Calouro removido do grupo com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover calouro do grupo', message: error.message });
  }
});

router.delete('/:id', autorizarRoles('ORIENTADOR', 'ADMINISTRADOR'), (req, res) => {
  try {
    const g = getGrupoById(req.params.id);
    if (!g) {
      return res.status(404).json({ error: 'Grupo não encontrado' });
    }

    if (req.usuario.role === 'ADMINISTRADOR') {
      const adminObj = getAdministradorByUsuarioId(req.usuario.id);
      const isOwner = (g.admin_id && ((adminObj && g.admin_id === adminObj.id) || g.admin_id === req.usuario.id));
      if (!isOwner) {
        return res.status(403).json({ error: 'Acesso negado para remover este grupo' });
      }
    }

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
