const db = require('../config/db');

// Busca resumida para os cards (não traz o texto completo para não pesar a rede)
const findAll = async () => {
  const query = 'SELECT id, title, level, image_url FROM contents ORDER BY created_at ASC';
  const { rows } = await db.query(query);
  return rows;
};

// Busca completa para quando o usuário clicar no artigo
const findById = async (id) => {
  const query = 'SELECT * FROM contents WHERE id = $1';
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

module.exports = {
  findAll,
  findById,
};