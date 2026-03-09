const categoryService = require('../services/categoryService');

const getAll = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    return res.status(200).json(categories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

module.exports = {
  getAll,
};