const dashboardService = require('../services/dashboardService');

const getSummary = async (req, res) => {
  try {
    const userId = req.user.id; // Vem da nossa "pulseira VIP" (o token JWT)
    
    // Opcional: O frontend pode passar na URL (ex: ?month=3&year=2026)
    const { month, year } = req.query; 

    const summary = await dashboardService.getMonthlySummary(userId, month, year);

    return res.status(200).json(summary);
  } catch (error) {
    console.error('Erro ao gerar resumo do dashboard:', error);
    return res.status(500).json({ error: 'Erro interno no servidor ao gerar o dashboard.' });
  }
};

const getExpensesByCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query; 

    const data = await dashboardService.getExpensesByCategorySummary(userId, month, year);

    return res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao buscar despesas por categoria:', error);
    return res.status(500).json({ error: 'Erro interno ao gerar dados do gráfico.' });
  }
};

const getAnnualOverview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { year } = req.query; // Ex: ?year=2026

    const data = await dashboardService.getAnnualOverviewSummary(userId, year);

    return res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao buscar visão anual:', error);
    return res.status(500).json({ error: 'Erro interno ao gerar dados do gráfico anual.' });
  }
};

module.exports = {
  getSummary,
  getExpensesByCategory,
  getAnnualOverview, // Exportar a nova função
};