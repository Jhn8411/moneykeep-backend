const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Testando a conexão inicial
pool.on('connect', () => {
  console.log('📦 Conexão com o banco de dados PostgreSQL estabelecida com sucesso!');
});

module.exports = {
  // Exportamos o método query para usarmos nos nossos Repositories/Models
  query: (text, params) => pool.query(text, params),
};