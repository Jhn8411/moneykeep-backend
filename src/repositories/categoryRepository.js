const db = require('../config/db');

const findAll = async () => {
  // Busca todas as categorias e ordena por nome em ordem alfabética (ASC)
  const query = 'SELECT id, name FROM categories ORDER BY name ASC';
  const { rows } = await db.query(query);
  return rows;
};

module.exports = {
  findAll,
};