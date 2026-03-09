const categoryRepository = require('../repositories/categoryRepository');

const getAllCategories = async () => {
  const categories = await categoryRepository.findAll();
  return categories;
};

module.exports = {
  getAllCategories,
};