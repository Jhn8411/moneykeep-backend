const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Importando rotas
const userRoutes        = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const categoryRoutes    = require('./routes/categoryRoutes');
const dashboardRoutes   = require('./routes/dashboardRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const contentRoutes     = require('./routes/contentRoutes');
const recurringRoutes   = require('./routes/recurringRoutes'); // ← NOVO

const app = express();

// 1. HELMET PRIMEIRO: Ele deve ser o primeiro middleware a ser chamado.
// Desativamos apenas a política CORP para que o seu front-end (em outra porta) consiga ler a API.
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// 2. CONFIGURAÇÃO DO CORS
const corsOptions = {
  origin: [
    'http://localhost:3000', 
    'http://localhost:5173', 
    'https://seusiteoficial.com.br', 
    'https://moneykeep-dinheirointeligente.vercel.app' // <-- Adicionado o https:// aqui!
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API do MoneyKeep está rodando! 🚀' });
});

// Conectando as rotas no app
app.use('/api/users',           userRoutes);
app.use('/api/transactions',    transactionRoutes);
app.use('/api/categories',      categoryRoutes);
app.use('/api/dashboard',       dashboardRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/contents',        contentRoutes);
app.use('/api/recurring',       recurringRoutes); // ← NOVO

module.exports = app;