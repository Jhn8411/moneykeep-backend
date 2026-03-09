const db = require('../config/db');

// Busca um usuário pelo email
const findByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const { rows } = await db.query(query, [email]);
  return rows[0]; // Retorna o usuário se encontrar, ou undefined se não encontrar
};

// Cria um novo usuário no banco
const create = async (name, email, hashedPassword) => {
  const query = `
    INSERT INTO users (name, email, password) 
    VALUES ($1, $2, $3) 
    RETURNING id, name, email, created_at
  `;
  // O RETURNING devolve os dados recém-criados (sem a senha!) para mandarmos de volta pro frontend
  const { rows } = await db.query(query, [name, email, hashedPassword]);
  return rows[0];
};

module.exports = {
  findByEmail,
  create,
};