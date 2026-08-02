const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const authRoutes = require('./src/routes/authRoutes');
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const mentorRoutes = require('./src/routes/mentorRoutes');
const calouroRoutes = require('./src/routes/calouroRoutes');
const grupoRoutes = require('./src/routes/grupoRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/mentores', mentorRoutes);
app.use('/api/calouros', calouroRoutes);
app.use('/api/grupos', grupoRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API do SGA está rodando!',
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: err.message 
  });
});


app.listen(PORT, () => {
  console.log(` Servidor rodando na porta ${PORT}`);
  console.log(` http://localhost:${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
});