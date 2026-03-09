const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importando rotas
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const contentRoutes = require('./routes/contentRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API do MoneyKeep está rodando! 🚀' });
});

// Conectando as rotas no app
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/contents', contentRoutes);

module.exports = app;