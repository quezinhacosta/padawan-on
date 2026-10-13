const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { 
  getAllUsuarios, 
  getUsuarioById, 
  updateUsuario, 
  deleteUsuario,
  logAtividade 
} = require('../database');
const { autenticarToken, autorizarRoles } = require('../middleware/auth');

router.use(autenticarToken);

router.get('/', autorizarRoles('ORIENTADOR', 'ADMINISTRADOR'), (req, res) => {
  try {
    const { role } = req.query;
    const usuarios = getAllUsuarios(role);
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar usuários', message: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const usuario = getUsuarioById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter usuário', message: error.message });
  }
});

router.put('/:id', autorizarRoles('ORIENTADOR', 'ADMINISTRADOR'), (req, res) => {
  try {
    const usuarioAlvo = getUsuarioById(req.params.id);
    if (!usuarioAlvo) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (req.usuario.role === 'ADMINISTRADOR' && usuarioAlvo.role === 'ORIENTADOR') {
      return res.status(403).json({ error: 'Administradores não têm permissão para alterar o orientador' });
    }

    const { nomeCompleto, nomeUsuario, email, fotoPerfil, ativo, novaSenha } = req.body;
    let senhaHash = undefined;

    if (novaSenha && novaSenha.length >= 4) {
      const salt = bcrypt.genSaltSync(10);
      senhaHash = bcrypt.hashSync(novaSenha, salt);
    }

    updateUsuario(req.params.id, {
      nomeCompleto,
      nomeUsuario,
      email,
      fotoPerfil,
      ativo,
      senhaHash
    });

    logAtividade({
      usuarioId: req.usuario.id,
      tipo: 'USUARIO_ATUALIZADO',
      descricao: `Usuário ID ${req.params.id} atualizado`
    });

    res.json({ success: true, message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar usuário', message: error.message });
  }
});

router.delete('/:id', autorizarRoles('ORIENTADOR', 'ADMINISTRADOR'), (req, res) => {
  try {
    const usuarioAlvo = getUsuarioById(req.params.id);
    if (!usuarioAlvo) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (req.usuario.role === 'ADMINISTRADOR' && usuarioAlvo.role === 'ORIENTADOR') {
      return res.status(403).json({ error: 'Administradores não têm permissão para remover o orientador' });
    }

    deleteUsuario(req.params.id);
    logAtividade({
      usuarioId: req.usuario.id,
      tipo: 'USUARIO_REMOVIDO',
      descricao: `Usuário ID ${req.params.id} removido`
    });
    res.json({ success: true, message: 'Usuário excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover usuário', message: error.message });
  }
});

module.exports = router;
