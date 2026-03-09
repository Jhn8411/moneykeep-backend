const contentService = require('../services/contentService');

const getAll = async (req, res) => {
  try {
    const contents = await contentService.getAllGroupedByLevel();
    return res.status(200).json(contents);
  } catch (error) {
    console.error('Erro ao buscar conteúdos:', error);
    return res.status(500).json({ error: 'Erro interno ao carregar a trilha de aprendizado.' });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params; // Pega o ID que vem na URL (ex: /api/contents/123)
    
    const content = await contentService.getContentById(id);
    return res.status(200).json(content);
    
  } catch (error) {
    if (error.message === 'Conteúdo educativo não encontrado.') {
      return res.status(404).json({ error: error.message }); // 404 Not Found
    }
    console.error('Erro ao buscar detalhes do conteúdo:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

module.exports = {
  getAll,
  getById,
};