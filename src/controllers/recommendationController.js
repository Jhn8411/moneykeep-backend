const recommendationService = require('../services/recommendationService');

const generateUserRecommendations = async (req, res) => {
  try {
    const userId = req.user.id; // Pegamos o ID do token JWT
    const { month, year } = req.query;

    const recommendations = await recommendationService.getRecommendations(userId, month, year);

    return res.status(200).json(recommendations);
  } catch (error) {
    console.error('Erro ao gerar recomendações:', error);
    return res.status(500).json({ error: 'Erro interno ao analisar saúde financeira.' });
  }
};

module.exports = {
  generateUserRecommendations,
};