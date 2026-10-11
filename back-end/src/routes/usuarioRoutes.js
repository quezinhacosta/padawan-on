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

router.get('/', autorizarRoles('ORIENTADOR'), (req, res) => {
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

router.put('/:id', autorizarRoles('ORIENTADOR'), (req, res) => {
  try {
    const { nomeCompleto, email, ativo, novaSenha } = req.body;
    let senhaHash = undefined;

    if (novaSenha && novaSenha.length >= 4) {
      const salt = bcrypt.genSaltSync(10);
      senhaHash = bcrypt.hashSync(novaSenha, salt);
    }

    updateUsuario(req.params.id, {
      nomeCompleto,
      email,
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

router.delete('/:id', autorizarRoles('ORIENTADOR'), (req, res) => {
  try {
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
