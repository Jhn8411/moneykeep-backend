const transactionRepository = require('../repositories/transactionRepository');
const recurringRepository   = require('../repositories/recurringRepository');

const addTransaction = async (userId, transactionData) => {
  // 1. Validações básicas
  if (transactionData.type !== 'income' && transactionData.type !== 'expense') {
    throw new Error('Tipo de transação inválido. Use "income" ou "expense".');
  }
  if (transactionData.amount <= 0) {
    throw new Error('O valor da transação deve ser maior que zero.');
  }

  // 2. Extrair o dia de vencimento direto da data da transação
  //    Ex: transaction_date = "2025-01-20" → due_day = 20
  let dueDay = null;
  if (transactionData.is_recurring && transactionData.type === 'expense') {
    if (!transactionData.transaction_date) {
      throw new Error('A data da transação é obrigatória para despesas recorrentes.');
    }
    // transaction_date pode vir como "YYYY-MM-DD"
    const dateParts = transactionData.transaction_date.split('-');
    dueDay = parseInt(dateParts[2], 10); // pega o dia
    if (isNaN(dueDay) || dueDay < 1 || dueDay > 31) {
      throw new Error('Data da transação inválida.');
    }
    transactionData.due_day = dueDay;
  }

  // 3. Salva a transação
  const newTransaction = await transactionRepository.create(userId, transactionData);

  // 4. Se marcada como recorrente, cria automaticamente em recurring_expenses
  if (transactionData.is_recurring && transactionData.type === 'expense') {
    await recurringRepository.create(userId, {
      category_id: transactionData.category_id || null,
      description: transactionData.description || 'Despesa recorrente',
      amount:      transactionData.amount,
      due_day:     dueDay,
    });
  }

  return newTransaction;
};

const getUserTransactions = async (userId) => {
  return transactionRepository.findAllByUserId(userId);
};

module.exports = { addTransaction, getUserTransactions };
