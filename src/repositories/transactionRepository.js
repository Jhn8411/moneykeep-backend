const db = require('../config/db');

// Cria uma nova transação
const create = async (userId, transactionData) => {
  const { category_id, type, amount, description, transaction_date, is_recurring, due_day } = transactionData;

  const query = `
    INSERT INTO transactions (user_id, category_id, type, amount, description, transaction_date, is_recurring, due_day)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;

  const values = [
    userId,
    category_id || null,
    type,
    amount,
    description || null,
    transaction_date,
    is_recurring || false,
    is_recurring ? due_day : null,
  ];

  const { rows } = await db.query(query, values);
  return rows[0];
};

// Lista as transações de um usuário, trazendo o nome da categoria
const findAllByUserId = async (userId) => {
  const query = `
    SELECT
      t.id, t.type, t.amount, t.description, t.transaction_date,
      t.is_recurring, t.due_day,
      c.id as category_id, c.name as category_name
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = $1
    ORDER BY t.transaction_date DESC
  `;

  const { rows } = await db.query(query, [userId]);
  return rows;
};

module.exports = { create, findAllByUserId };
