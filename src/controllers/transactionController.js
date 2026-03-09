const transactionService = require('../services/transactionService');

const create = async (req, res) => {
  try {
    // Pegamos o ID do usuário injetado pelo nosso middleware de autenticação!
    const userId = req.user.id; 
    const transactionData = req.body;

    // Validação básica dos campos obrigatórios
    if (!transactionData.type || !transactionData.amount || !transactionData.transaction_date) {
      return res.status(400).json({ error: 'Tipo, valor e data são obrigatórios.' });
    }

    const newTransaction = await transactionService.addTransaction(userId, transactionData);

    return res.status(201).json({
      message: 'Transação registrada com sucesso!',
      transaction: newTransaction
    });

  } catch (error) {
    if (error.message.includes('inválido') || error.message.includes('maior que zero')) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Erro ao criar transação:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

const getAll = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await transactionService.getUserTransactions(userId);

    return res.status(200).json(transactions);
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

module.exports = {
  create,
  getAll
};