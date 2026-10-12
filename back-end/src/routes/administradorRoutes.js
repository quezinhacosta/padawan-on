const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { 
  getAllAdministradores, 
  getAdministradorById, 
  createAdministrador, 
  updateAdministrador, 
  deleteAdministrador,
  createUsuario,
  getUsuarioByRA,
  getUsuarioByEmail,
  logAtividade 
} = require('../database');
const { autenticarToken, autorizarRoles } = require('../middleware/auth');

router.use(autenticarToken);

router.get('/', autorizarRoles('ORIENTADOR'), (req, res) => {
  try {
    const administradores = getAllAdministradores();
    res.json(administradores);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar administradores', message: error.message });
  }
});

router.get('/:id', autorizarRoles('ORIENTADOR', 'ADMINISTRADOR'), (req, res) => {
  try {
    const admin = getAdministradorById(req.params.id);
    if (!admin) {
      return res.status(404).json({ error: 'Administrador não encontrado' });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar administrador', message: error.message });
  }
});

router.post('/', autorizarRoles('ORIENTADOR'), async (req, res) => {
  try {
    const { 
      nomeCompleto, 
      nomeUsuario, 
      ra, 
      email, 
      senha = 'admin', 
      departamento = 'Ciência da Computação', 
      cargo = 'Líder / Administrador de Grupo' 
    } = req.body;

    if (!nomeCompleto || !ra || !email) {
      return res.status(400).json({ error: 'Nome completo, RA e e-mail são obrigatórios' });
    }

    if (getUsuarioByRA(ra)) {
      return res.status(400).json({ error: 'RA já cadastrado no sistema' });
    }

    if (getUsuarioByEmail(email)) {
      return res.status(400).json({ error: 'E-mail já cadastrado no sistema' });
    }

    const salt = bcrypt.genSaltSync(10);
    const senhaHash = bcrypt.hashSync(senha, salt);
    const username = nomeUsuario || email.split('@')[0];

    const resultUsuario = createUsuario({
      nomeUsuario: username,
      nomeCompleto,
      email,
      ra,
      senhaHash,
      role: 'ADMINISTRADOR',
      ativo: 1
    });

    const usuarioId = resultUsuario.lastInsertRowid;
    const resultAdmin = createAdministrador({
      usuarioId,
      departamento,
      cargo
    });

    logAtividade({
      usuarioId: req.usuario.id,
      tipo: 'ADMINISTRADOR_CRIADO',
      descricao: `Administrador ${nomeCompleto} cadastrado com sucesso.`
    });

    res.status(201).json({
      success: true,
      message: 'Administrador cadastrado com sucesso',
      id: resultAdmin.lastInsertRowid,
      usuarioId
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar administrador', message: error.message });
  }
});

router.put('/:id', autorizarRoles('ORIENTADOR'), (req, res) => {
  try {
    const { departamento, cargo } = req.body;
    updateAdministrador(req.params.id, { departamento, cargo });

    logAtividade({
      usuarioId: req.usuario.id,
      tipo: 'ADMINISTRADOR_ATUALIZADO',
      descricao: `Administrador ID ${req.params.id} atualizado.`
    });

    res.json({ success: true, message: 'Administrador atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar administrador', message: error.message });
  }
});

router.delete('/:id', autorizarRoles('ORIENTADOR'), (req, res) => {
  try {
    const admin = getAdministradorById(req.params.id);
    if (!admin) {
      return res.status(404).json({ error: 'Administrador não encontrado' });
    }

    deleteAdministrador(req.params.id);

    logAtividade({
      usuarioId: req.usuario.id,
      tipo: 'ADMINISTRADOR_REMOVIDO',
      descricao: `Administrador ${admin.nome} removido do sistema.`
    });

    res.json({ success: true, message: 'Administrador excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir administrador', message: error.message });
  }
});

module.exports = router;

