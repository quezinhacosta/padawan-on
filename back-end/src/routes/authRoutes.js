const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { 
  getUsuarioByIdentifier,
  getUsuarioByRA, 
  getUsuarioByEmail, 
  getUsuarioById,
  updateUsuario,
  createUsuario, 
  createCalouro, 
  createMentor,
  getMentorByUsuarioId,
  getCalouroByUsuarioId,
  getAdministradorByUsuarioId,
  getOrientadorByUsuarioId,
  logAtividade 
} = require('../database');
const { autenticarToken, JWT_SECRET } = require('../middleware/auth');

router.post('/login', async (req, res) => {
  try {
    const { ra, email, senha, role } = req.body;
    const identifier = (ra || email || '').trim();

    if (!identifier || !senha) {
      return res.status(400).json({ error: 'Identificador (RA ou E-mail) e senha são obrigatórios' });
    }

    const usuario = getUsuarioByIdentifier(identifier);
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    if (!usuario.ativo) {
      return res.status(403).json({ error: 'Usuário inativo' });
    }

    let senhaValida = false;
    if (usuario.senha_hash.startsWith('$2a$') || usuario.senha_hash.startsWith('$2b$')) {
      senhaValida = bcrypt.compareSync(senha, usuario.senha_hash);
    } else {
      senhaValida = senha === usuario.senha_hash;
    }

    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    if (role && usuario.role !== role) {
      const isAdmOrOrientador = (usuario.role === 'ORIENTADOR' && role === 'ADMINISTRADOR');
      if (!isAdmOrOrientador) {
        return res.status(403).json({ 
          error: `Perfil selecionado (${role}) difere do perfil cadastrado (${usuario.role})` 
        });
      }
    }

    const token = jwt.sign(
      { id: usuario.id, role: usuario.role, ra: usuario.ra },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    let detalhesPerfil = null;
    if (usuario.role === 'MENTOR') {
      detalhesPerfil = getMentorByUsuarioId(usuario.id);
    } else if (usuario.role === 'CALOURO') {
      detalhesPerfil = getCalouroByUsuarioId(usuario.id);
    } else if (usuario.role === 'ADMINISTRADOR') {
      detalhesPerfil = getAdministradorByUsuarioId(usuario.id);
    } else if (usuario.role === 'ORIENTADOR') {
      detalhesPerfil = getOrientadorByUsuarioId(usuario.id);
    }

    const { senha_hash, ...usuarioSemSenha } = usuario;

    logAtividade({
      usuarioId: usuario.id,
      tipo: 'LOGIN',
      descricao: `${usuario.nome_completo} realizou login como ${usuario.role}.`,
      ip: req.ip
    });

    res.json({
      success: true,
      token,
      usuario: {
        ...usuarioSemSenha,
        nome: usuario.nome_completo,
        detalhes: detalhesPerfil
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao autenticar usuário', detalhe: error.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { 
      nomeUsuario, 
      nomeCompleto, 
      ra, 
      email, 
      senha, 
      role = 'CALOURO', 
      curso = 'Ciência da Computação', 
      periodo = '1º Período',
      especialidades = ''
    } = req.body;

    if (!nomeUsuario || !nomeCompleto || !ra || !senha) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
    }

    if (senha.length < 4) {
      return res.status(400).json({ error: 'A senha deve ter no mínimo 4 caracteres' });
    }

    const roleNormalizada = (role || 'CALOURO').toUpperCase().trim();
    if (roleNormalizada !== 'CALOURO' && roleNormalizada !== 'MENTOR') {
      return res.status(403).json({ error: 'Apenas calouros e mentores podem se cadastrar publicamente' });
    }

    const raExistente = getUsuarioByRA(ra);
    if (raExistente) {
      return res.status(400).json({ error: 'Já existe uma conta cadastrada com este RA' });
    }

    const emailCalculado = email && email.trim() !== '' ? email.trim() : `${nomeUsuario.toLowerCase().replace(/\s+/g, '')}@unicap.br`;
    const emailExistente = getUsuarioByEmail(emailCalculado);
    if (emailExistente) {
      return res.status(400).json({ error: 'Já existe uma conta cadastrada com este e-mail' });
    }

    const salt = bcrypt.genSaltSync(10);
    const senhaHash = bcrypt.hashSync(senha, salt);

    const userRes = createUsuario({
      nomeUsuario: nomeUsuario.trim(),
      nomeCompleto: nomeCompleto.trim(),
      email: emailCalculado,
      ra: ra.trim(),
      senhaHash,
      role: roleNormalizada,
      ativo: 1
    });

    const novoUsuarioId = userRes.lastInsertRowid;

    if (roleNormalizada === 'MENTOR') {
      createMentor({
        usuarioId: novoUsuarioId,
        especialidades: especialidades || ''
      });
      logAtividade({
        usuarioId: novoUsuarioId,
        tipo: 'MENTOR_ADICIONADO',
        descricao: `Novo mentor cadastrado: ${nomeCompleto} (${ra})`
      });
    } else {
      createCalouro({
        usuarioId: novoUsuarioId,
        curso,
        periodo
      });
      logAtividade({
        usuarioId: novoUsuarioId,
        tipo: 'CALOURO_ADICIONADO',
        descricao: `Novo calouro cadastrado: ${nomeCompleto} (${ra})`
      });
    }

    const token = jwt.sign(
      { id: novoUsuarioId, role: roleNormalizada, ra },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Cadastro realizado com sucesso',
      token,
      usuario: {
        id: novoUsuarioId,
        nome: nomeCompleto,
        nome_completo: nomeCompleto,
        nome_usuario: nomeUsuario,
        email: emailCalculado,
        ra,
        role: roleNormalizada,
        ativo: 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar usuário', detalhe: error.message });
  }
});

router.get('/me', autenticarToken, (req, res) => {
  let detalhes = null;
  if (req.usuario.role === 'MENTOR') {
    detalhes = getMentorByUsuarioId(req.usuario.id);
  } else if (req.usuario.role === 'CALOURO') {
    detalhes = getCalouroByUsuarioId(req.usuario.id);
  } else if (req.usuario.role === 'ADMINISTRADOR') {
    detalhes = getAdministradorByUsuarioId(req.usuario.id);
  } else if (req.usuario.role === 'ORIENTADOR') {
    detalhes = getOrientadorByUsuarioId(req.usuario.id);
  }

  res.json({
    usuario: {
      ...req.usuario,
      nome: req.usuario.nome_completo,
      detalhes
    }
  });
});

router.put('/perfil', autenticarToken, async (req, res) => {
  try {
    const { nome, nomeCompleto, email, novaSenha, senhaAtual, fotoPerfil } = req.body;
    const finalNome = (nomeCompleto || nome || '').trim();

    if (email && email.trim() !== req.usuario.email) {
      const emailExistente = getUsuarioByEmail(email.trim());
      if (emailExistente && emailExistente.id !== req.usuario.id) {
        return res.status(400).json({ error: 'Este e-mail já está em uso por outro usuário' });
      }
    }

    let senhaHash = undefined;
    if (novaSenha && novaSenha.trim() !== '') {
      if (novaSenha.trim().length < 4) {
        return res.status(400).json({ error: 'A nova senha deve ter no mínimo 4 caracteres' });
      }

      const usuarioDb = getUsuarioByIdentifier(req.usuario.ra || req.usuario.email);
      if (senhaAtual) {
        let senhaCorreta = false;
        if (usuarioDb.senha_hash.startsWith('$2a$') || usuarioDb.senha_hash.startsWith('$2b$')) {
          senhaCorreta = bcrypt.compareSync(senhaAtual, usuarioDb.senha_hash);
        } else {
          senhaCorreta = senhaAtual === usuarioDb.senha_hash;
        }
        if (!senhaCorreta) {
          return res.status(400).json({ error: 'A senha atual informada está incorreta' });
        }
      }

      const salt = bcrypt.genSaltSync(10);
      senhaHash = bcrypt.hashSync(novaSenha.trim(), salt);
    }

    updateUsuario(req.usuario.id, {
      nomeCompleto: finalNome || undefined,
      email: email ? email.trim() : undefined,
      fotoPerfil: fotoPerfil !== undefined ? fotoPerfil : undefined,
      senhaHash
    });

    const usuarioAtualizado = getUsuarioById(req.usuario.id);

    logAtividade({
      usuarioId: req.usuario.id,
      tipo: 'PERFIL_ATUALIZADO',
      descricao: `${usuarioAtualizado.nome_completo} atualizou seus dados de perfil`
    });

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      usuario: {
        ...usuarioAtualizado,
        nome: usuarioAtualizado.nome_completo
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar perfil', message: error.message });
  }
});

module.exports = router;