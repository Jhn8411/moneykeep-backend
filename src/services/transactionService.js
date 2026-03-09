const transactionRepository = require('../repositories/transactionRepository');

const addTransaction = async (userId, transactionData) => {
  // 1. Valida se o tipo enviado é válido (evita que mandem algo diferente de income/expense)
  if (transactionData.type !== 'income' && transactionData.type !== 'expense') {
    throw new Error('Tipo de transação inválido. Use "income" ou "expense".');
  }

  // 2. Valida se o valor é positivo
  if (transactionData.amount <= 0) {
    throw new Error('O valor da transação deve ser maior que zero.');
  }

  // 3. Salva no banco de dados
  const newTransaction = await transactionRepository.create(userId, transactionData);
  return newTransaction;
};

const getUserTransactions = async (userId) => {
  const transactions = await transactionRepository.findAllByUserId(userId);
  return transactions;
};

module.exports = {
  addTransaction,
  getUserTransactions
};