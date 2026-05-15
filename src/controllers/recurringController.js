const recurringService = require('../services/recurringService');

/* POST /api/recurring */
const create = async (req, res) => {
  try {
    const userId = req.user.id;
    const item = await recurringService.create(userId, req.body);
    return res.status(201).json({ message: 'Despesa recorrente criada com sucesso!', item });
  } catch (error) {
    const isValidation = ['obrigatória', 'maior que zero', 'entre 1 e 31'].some(
      (msg) => error.message.includes(msg)
    );
    if (isValidation) return res.status(400).json({ error: error.message });
    console.error('Erro ao criar recorrente:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

/* GET /api/recurring */
const getAll = async (req, res) => {
  try {
    const items = await recurringService.getAll(req.user.id);
    return res.status(200).json(items);
  } catch (error) {
    console.error('Erro ao listar recorrentes:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

/* PUT /api/recurring/:id */
const update = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params; // UUID — não converter com parseInt
    const item = await recurringService.update(userId, id, req.body);
    return res.status(200).json({ message: 'Despesa recorrente atualizada!', item });
  } catch (error) {
    if (error.message === 'Acesso negado.')        return res.status(403).json({ error: error.message });
    if (error.message.includes('não encontrada'))  return res.status(404).json({ error: error.message });
    const isValidation = ['obrigatória', 'maior que zero', 'entre 1 e 31'].some(
      (msg) => error.message.includes(msg)
    );
    if (isValidation) return res.status(400).json({ error: error.message });
    console.error('Erro ao atualizar recorrente:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

/* DELETE /api/recurring/:id */
const remove = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params; // UUID — não converter com parseInt
    await recurringService.remove(userId, id);
    return res.status(200).json({ message: 'Despesa recorrente removida.' });
  } catch (error) {
    if (error.message === 'Acesso negado.')        return res.status(403).json({ error: error.message });
    if (error.message.includes('não encontrada'))  return res.status(404).json({ error: error.message });
    console.error('Erro ao remover recorrente:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

module.exports = { create, getAll, update, remove };
