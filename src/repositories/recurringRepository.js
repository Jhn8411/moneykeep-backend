const db = require('../config/db');

/* ── Criar nova despesa recorrente ── */
const create = async (userId, data) => {
  const { category_id, description, amount, due_day } = data;
  const query = `
    INSERT INTO recurring_expenses (user_id, category_id, description, amount, due_day)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const { rows } = await db.query(query, [userId, category_id || null, description, amount, due_day]);
  return rows[0];
};

/* ── Listar todas de um usuário, com nome da categoria ── */
const findAllByUserId = async (userId) => {
  const query = `
    SELECT
      r.id,
      r.description,
      r.amount,
      r.due_day,
      r.created_at,
      c.id   AS category_id,
      c.name AS category_name
    FROM recurring_expenses r
    LEFT JOIN categories c ON r.category_id = c.id
    WHERE r.user_id = $1
    ORDER BY r.due_day ASC, r.created_at DESC
  `;
  const { rows } = await db.query(query, [userId]);
  return rows;
};

/* ── Buscar por ID (para verificar dono) ── */
const findById = async (id) => {
  const { rows } = await db.query(
    'SELECT * FROM recurring_expenses WHERE id = $1',
    [id]
  );
  return rows[0] || null;
};

/* ── Atualizar ── */
const update = async (id, data) => {
  const { category_id, description, amount, due_day } = data;
  const query = `
    UPDATE recurring_expenses
    SET category_id = $1,
        description = $2,
        amount      = $3,
        due_day     = $4
    WHERE id = $5
    RETURNING *
  `;
  const { rows } = await db.query(query, [category_id || null, description, amount, due_day, id]);
  return rows[0];
};

/* ── Excluir ── */
const remove = async (id) => {
  await db.query('DELETE FROM recurring_expenses WHERE id = $1', [id]);
};

module.exports = { create, findAllByUserId, findById, update, remove };
