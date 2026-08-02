const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUsuarioByRA, createUsuario } = require('../database');

// Login
router.post('/login', async (req, res) => {
  try {
    const { ra, senha, role } = req.body;

    // Buscar usuário
    const usuario = getUsuarioByRA(ra);
    
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar senha (em produção, use bcrypt)
    const senhaValida = senha === usuario.senha_hash;
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar role
    if (usuario.role !== role) {
      return res.status(401).json({ error: 'Perfil inválido para este acesso' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: usuario.id, role: usuario.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '7d' }
    );

    // Remover senha
    const { senha_hash, ...usuarioData } = usuario;

    res.json({
      success: true,
      token,
      usuario: usuarioData
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Registro (apenas calouros)
router.post('/register', async (req, res) => {
  try {
    const { nomeUsuario, nomeCompleto, ra, email, senha } = req.body;

    // Verificar se já existe
    const usuarioExistente = getUsuarioByRA(ra);
    if (usuarioExistente) {
      return res.status(400).json({ error: 'RA já cadastrado' });
    }

    // Hash da senha (em produção)
    const senhaHash = senha; // Temporário

    // Criar usuário
    const result = createUsuario({
      nomeUsuario,
      nomeCompleto,
      email,
      ra,
      senhaHash,
      role: 'CALOURO'
    });

    // Criar registro de calouro
    const db = require('../database').db;
    const stmt = db.prepare(`
      INSERT INTO calouros (usuario_id, curso, periodo)
      VALUES (?, ?, ?)
    `);
    stmt.run(result.lastInsertRowid, 'Ciência da Computação', '1º Período');

    res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso'
    });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ error: 'Erro ao cadastrar' });
  }
});

module.exports = router;