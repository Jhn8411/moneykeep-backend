const recurringRepository = require('../repositories/recurringRepository');

const create = async (userId, data) => {
  const { description, amount, due_day } = data;
  if (!description || !description.trim()) throw new Error('A descrição é obrigatória.');
  if (!amount || parseFloat(amount) <= 0)  throw new Error('O valor deve ser maior que zero.');
  const day = parseInt(due_day, 10);
  // Aceita até 31; meses sem esse dia usam o último dia (tratado no frontend/relatório)
  if (!day || day < 1 || day > 31) throw new Error('O dia de vencimento deve ser entre 1 e 31.');
  return recurringRepository.create(userId, { ...data, amount: parseFloat(amount), due_day: day });
};

const getAll = async (userId) => {
  return recurringRepository.findAllByUserId(userId);
};

const update = async (userId, id, data) => {
  const existing = await recurringRepository.findById(id);
  if (!existing)                   throw new Error('Despesa recorrente não encontrada.');
  if (existing.user_id !== userId) throw new Error('Acesso negado.');

  const { description, amount, due_day } = data;
  if (!description || !description.trim()) throw new Error('A descrição é obrigatória.');
  if (!amount || parseFloat(amount) <= 0)  throw new Error('O valor deve ser maior que zero.');
  const day = parseInt(due_day, 10);
  if (!day || day < 1 || day > 31) throw new Error('O dia de vencimento deve ser entre 1 e 31.');

  return recurringRepository.update(id, { ...data, amount: parseFloat(amount), due_day: day });
};

const remove = async (userId, id) => {
  const existing = await recurringRepository.findById(id);
  if (!existing)                   throw new Error('Despesa recorrente não encontrada.');
  if (existing.user_id !== userId) throw new Error('Acesso negado.');
  await recurringRepository.remove(id);
};

module.exports = { create, getAll, update, remove };
