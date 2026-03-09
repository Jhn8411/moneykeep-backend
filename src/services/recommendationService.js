const dashboardService = require('./dashboardService');

const getRecommendations = async (userId, queryMonth, queryYear) => {
  const recommendations = [];
  
  // 1. Reutilizamos as funções maravilhosas que já criámos no Dashboard!
  const summary = await dashboardService.getMonthlySummary(userId, queryMonth, queryYear);
  const expensesByCategory = await dashboardService.getExpensesByCategorySummary(userId, queryMonth, queryYear);

  // REGRA 1: Gastos por categoria (Exatamente como desenhou no Figma!)
  expensesByCategory.forEach(expense => {
    // Se a categoria representar 40% ou mais de todas as despesas do mês
    if (expense.percentage >= 40) {
      recommendations.push({
        type: 'warning', // Define a cor/ícone no frontend (amarelo/laranja)
        title: `Gasto elevado com ${expense.category}`,
        message: `Parece que você gastou ${expense.percentage}% das suas despesas com ${expense.category.toLowerCase()} este mês. Que tal diminuir isso?`
      });
    }
  });

  // REGRA 2: Alerta de Orçamento Estourado (Despesas > Receitas)
  if (summary.monthIncome > 0 && summary.monthExpense > summary.monthIncome) {
    recommendations.push({
      type: 'danger', // Cor vermelha no frontend
      title: 'Orçamento estourado',
      message: 'Atenção! As suas despesas já ultrapassaram os seus ganhos este mês. Tente cortar gastos não essenciais.'
    });
  }

  // REGRA 3: Elogio de Bom Comportamento Financeiro
  if (summary.monthIncome > 0 && summary.monthExpense <= (summary.monthIncome * 0.5)) {
    // Se gastou 50% ou menos do que ganhou
    recommendations.push({
      type: 'success', // Cor verde no frontend
      title: 'Ótimo controle financeiro',
      message: 'Parabéns! Gastou metade (ou menos) dos seus ganhos este mês. Considere poupar ou investir o que sobrou.'
    });
  }

  // Se o utilizador for novo e não tiver nenhuma recomendação gerada
  if (recommendations.length === 0 && summary.monthExpense > 0) {
     recommendations.push({
      type: 'success',
      title: 'Tudo dentro do normal',
      message: 'Os seus gastos estão bem distribuídos. Continue a registar tudo para manter o controle!'
    });
  }

  return recommendations;
};

module.exports = {
  getRecommendations,
};