const jwt = require('jsonwebtoken');
const { getUsuarioById } = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'padawan_secret_key_2026';

function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : authHeader;

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido ou expirado' });
    }

    const usuario = getUsuarioById(decoded.id);
    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ error: 'Usuário não encontrado ou inativo' });
    }

    req.usuario = usuario;
    next();
  });
}

function autorizarRoles(...rolesPermitidas) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    if (!rolesPermitidas.includes(req.usuario.role)) {
      return res.status(403).json({ 
        error: `Acesso negado para o perfil ${req.usuario.role}` 
      });
    }

    next();
  };
}

module.exports = {
  autenticarToken,
  autorizarRoles,
  JWT_SECRET
};
