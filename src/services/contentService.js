const contentRepository = require('../repositories/contentRepository');

const getAllGroupedByLevel = async () => {
  const contents = await contentRepository.findAll();

  // Agrupando os dados para a tela de Aprendizado
  const groupedContents = {
    'Iniciante': contents.filter(c => c.level === 'Iniciante'),
    'Intermediário': contents.filter(c => c.level === 'Intermediário'),
    'Avançado': contents.filter(c => c.level === 'Avançado')
  };

  return groupedContents;
};

const getContentById = async (id) => {
  const content = await contentRepository.findById(id);
  
  if (!content) {
    throw new Error('Conteúdo educativo não encontrado.');
  }
  
  return content;
};

module.exports = {
  getAllGroupedByLevel,
  getContentById,
};