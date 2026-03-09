const db = require('../config/db');

const getSummary = async (userId, month, year) => {
  // Esta query faz a magia toda de uma vez só!
  // 1. Calcula o saldo total de sempre (receitas - despesas)
  // 2. Calcula as receitas apenas do mês/ano selecionados
  // 3. Calcula as despesas apenas do mês/ano selecionados
  const query = `
    SELECT 
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) AS total_balance,
      COALESCE(SUM(CASE WHEN type = 'income' AND EXTRACT(MONTH FROM transaction_date) = $2 AND EXTRACT(YEAR FROM transaction_date) = $3 THEN amount ELSE 0 END), 0) AS month_income,
      COALESCE(SUM(CASE WHEN type = 'expense' AND EXTRACT(MONTH FROM transaction_date) = $2 AND EXTRACT(YEAR FROM transaction_date) = $3 THEN amount ELSE 0 END), 0) AS month_expense
    FROM transactions
    WHERE user_id = $1
  `;
  
  const { rows } = await db.query(query, [userId, month, year]);
  
  // Como as funções de agregação do SQL (como o SUM) retornam strings em alguns drivers Node,
  // convertemos para número decimal para o frontend receber o tipo correto.
  return {
    totalBalance: parseFloat(rows[0].total_balance),
    monthIncome: parseFloat(rows[0].month_income),
    monthExpense: parseFloat(rows[0].month_expense)
  };
};

const getExpensesByCategory = async (userId, month, year) => {
  // O GROUP BY agrupa todas as despesas que têm a mesma categoria e o SUM soma os valores.
  const query = `
    SELECT 
      c.name AS category_name,
      SUM(t.amount) AS total_amount
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = $1 
      AND t.type = 'expense'
      AND EXTRACT(MONTH FROM t.transaction_date) = $2 
      AND EXTRACT(YEAR FROM t.transaction_date) = $3
    GROUP BY c.id, c.name
    ORDER BY total_amount DESC
  `;
  
  const { rows } = await db.query(query, [userId, month, year]);
  
  // Convertendo os valores de string (padrão do SUM no PG) para float
  return rows.map(row => ({
    categoryName: row.category_name,
    amount: parseFloat(row.total_amount)
  }));
};

const getAnnualOverview = async (userId, year) => {
  // Agrupa as transações pelo mês num ano específico
  const query = `
    SELECT 
      EXTRACT(MONTH FROM transaction_date) AS month,
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense
    FROM transactions
    WHERE user_id = $1 
      AND EXTRACT(YEAR FROM transaction_date) = $2
    GROUP BY EXTRACT(MONTH FROM transaction_date)
    ORDER BY month ASC
  `;
  
  const { rows } = await db.query(query, [userId, year]);
  
  // Retorna os dados convertidos para números reais
  return rows.map(row => ({
    month: parseInt(row.month),
    income: parseFloat(row.total_income),
    expense: parseFloat(row.total_expense)
  }));
};

module.exports = {
  getSummary,
  getExpensesByCategory,
  getAnnualOverview, // Exportar a nova função
};