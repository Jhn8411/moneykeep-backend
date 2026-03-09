const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');

// Obriga a ter o Token JWT para aceder a qualquer rota do dashboard
router.use(authMiddleware);

// Rota GET: http://localhost:3000/api/dashboard/summary
router.get('/summary', dashboardController.getSummary);

// NOVA ROTA: Gráfico de Rosca - http://localhost:3000/api/dashboard/expenses-by-category
router.get('/expenses-by-category', dashboardController.getExpensesByCategory);

// NOVA ROTA: Visão Anual (Gráfico de Barras) - http://localhost:3000/api/dashboard/annual-overview
router.get('/annual-overview', dashboardController.getAnnualOverview);

module.exports = router;