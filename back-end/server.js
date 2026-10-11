const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas da API
const authRoutes = require('./src/routes/authRoutes');
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const mentorRoutes = require('./src/routes/mentorRoutes');
const calouroRoutes = require('./src/routes/calouroRoutes');
const grupoRoutes = require('./src/routes/grupoRoutes');
const encontroRoutes = require('./src/routes/encontroRoutes');
const recursoRoutes = require('./src/routes/recursoRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/mentores', mentorRoutes);
app.use('/api/calouros', calouroRoutes);
app.use('/api/grupos', grupoRoutes);
app.use('/api/encontros', encontroRoutes);
app.use('/api/recursos', recursoRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    app: 'Padawan ON - SGA Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Tratamento de rota não encontrada
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error('❌ Erro capturado:', err.stack);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor SGA rodando na porta ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
});