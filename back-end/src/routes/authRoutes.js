const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { 
  getUsuarioByRA, 
  getUsuarioByEmail, 
  createUsuario, 
  createCalouro, 
  getMentorByUsuarioId,
  getCalouroByUsuarioId,
  logAtividade 
} = require('../database');
const { autenticarToken, JWT_SECRET } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { ra, senha, role } = req.body;

    if (!ra || !senha) {
      return res.status(400).json({ error: 'RA e senha são obrigatórios' });
    }

    const usuario = getUsuarioByRA(ra);
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    if (!usuario.ativo) {
      return res.status(403).json({ error: 'Usuário desativado pelo orientador' });
    }

    // Validação da senha com bcrypt (suportando fallback para texto puro se legado)
    let senhaValida = false;
    if (usuario.senha_hash.startsWith('$2a$') || usuario.senha_hash.startsWith('$2b$')) {
      senhaValida = bcrypt.compareSync(senha, usuario.senha_hash);
    } else {
      senhaValida = senha === usuario.senha_hash;
    }

    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Se o usuário selecionou um perfil específico na tela de login
    if (role && usuario.role !== role) {
      return res.status(403).json({ 
        error: `Perfil selecionado (${role}) difere do perfil cadastrado (${usuario.role})` 
      });
    }

    // Gerar token JWT com 7 dias de validade
    const token = jwt.sign(
      { id: usuario.id, role: usuario.role, ra: usuario.ra },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Dados complementares de acordo com o papel
    let detalhesPerfil = null;
    if (usuario.role === 'MENTOR') {
      detalhesPerfil = getMentorByUsuarioId(usuario.id);
    } else if (usuario.role === 'CALOURO') {
      detalhesPerfil = getCalouroByUsuarioId(usuario.id);
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
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao autenticar usuário', detalhe: error.message });
  }
});

// POST /api/auth/register (Cadastro de Calouro)
router.post('/register', async (req, res) => {
  try {
    const { nomeUsuario, nomeCompleto, ra, email, senha, curso = 'Ciência da Computação', periodo = '1º Período' } = req.body;

    if (!nomeUsuario || !nomeCompleto || !ra || !senha) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
    }

    if (senha.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres' });
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
      role: 'CALOURO',
      ativo: 1
    });

    const novoUsuarioId = userRes.lastInsertRowid;

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

    const token = jwt.sign(
      { id: novoUsuarioId, role: 'CALOURO', ra },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Cadastro realizado com sucesso!',
      token,
      usuario: {
        id: novoUsuarioId,
        nome: nomeCompleto,
        nome_completo: nomeCompleto,
        nome_usuario: nomeUsuario,
        email: emailCalculado,
        ra,
        role: 'CALOURO',
        ativo: 1
      }
    });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ error: 'Erro ao cadastrar usuário', detalhe: error.message });
  }
});

// GET /api/auth/me (Perfil do Usuário Autenticado)
router.get('/me', autenticarToken, (req, res) => {
  let detalhes = null;
  if (req.usuario.role === 'MENTOR') {
    detalhes = getMentorByUsuarioId(req.usuario.id);
  } else if (req.usuario.role === 'CALOURO') {
    detalhes = getCalouroByUsuarioId(req.usuario.id);
  }

  res.json({
    usuario: {
      ...req.usuario,
      nome: req.usuario.nome_completo,
      detalhes
    }
  });
});

module.exports = router;