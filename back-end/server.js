const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const authRoutes = require('./src/routes/authRoutes');
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const mentorRoutes = require('./src/routes/mentorRoutes');
const calouroRoutes = require('./src/routes/calouroRoutes');
const grupoRoutes = require('./src/routes/grupoRoutes');
const encontroRoutes = require('./src/routes/encontroRoutes');
const recursoRoutes = require('./src/routes/recursoRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const mensagemRoutes = require('./src/routes/mensagemRoutes');
const administradorRoutes = require('./src/routes/administradorRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/administradores', administradorRoutes);
app.use('/api/mentores', mentorRoutes);
app.use('/api/calouros', calouroRoutes);
app.use('/api/grupos', grupoRoutes);
app.use('/api/encontros', encontroRoutes);
app.use('/api/recursos', recursoRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/mensagens', mensagemRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    app: 'Padawan ON Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: err.message 
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;