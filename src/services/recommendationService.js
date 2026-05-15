const dashboardService = require('./dashboardService');

const getRecommendations = async (userId, queryMonth, queryYear) => {
  const recommendations = [];
  
  // 1. Reutilizamos as funções maravilhosas que já criámos no Dashboard!
  const summary = await dashboardService.getMonthlySummary(userId, queryMonth, queryYear);
  const expensesByCategory = await dashboardService.getExpensesByCategorySummary(userId, queryMonth, queryYear);

  // Auxiliares: Buscam categorias específicas (em minúsculas para não ter erro de digitação)
  const gastosCasa = expensesByCategory.find(e => e.category.toLowerCase() === 'contas de casa') || { amount: 0, percentage: 0 };
  const gastosInvestimento = expensesByCategory.find(e => e.category.toLowerCase() === 'investimentos') || { amount: 0, percentage: 0 };
  // Auxiliar: Somar gastos considerados "Desejos" (Ajuste os nomes conforme as suas categorias do banco)
  const gastosDesejos = expensesByCategory
    .filter(e => ['lazer', 'compras', 'delivery', 'assinaturas'].includes(e.category.toLowerCase()))
    .reduce((acc, curr) => acc + curr.amount, 0);

  // REGRA 1: Gastos por categoria (Exatamente como desenhou no Figma!)
  expensesByCategory.forEach(expense => {
    // Se a categoria representar 40% ou mais das despesas (e não for investimento, pois investir muito é bom!)
    if (expense.percentage >= 40 && expense.category.toLowerCase() !== 'investimentos') {
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

  // REGRA 3: Sinal Amarelo - Quase estourando o orçamento (entre 85% e 100%)
  if (summary.monthIncome > 0 && summary.monthExpense > (summary.monthIncome * 0.85) && summary.monthExpense <= summary.monthIncome) {
    recommendations.push({
      type: 'warning',
      title: 'Atenção ao limite do salário',
      message: 'Você já gastou mais de 85% dos seus ganhos este mês. Segure os gastos não essenciais para não fechar no vermelho!'
    });
  }

  // REGRA 4: Regra dos 50% para Custos Fixos (Contas de Casa)
  if (summary.monthIncome > 0 && gastosCasa.amount > (summary.monthIncome * 0.50)) {
    recommendations.push({
      type: 'warning',
      title: 'Custos fixos muito altos',
      message: 'As suas "Contas de casa" estão consumindo mais da metade da sua renda. O ideal é manter os custos de moradia em até 50% dos ganhos.'
    });
  }

  // REGRA 5: Incentivo a Investimentos (Regra dos 20%)
  if (summary.monthIncome > 0) {
    if (gastosInvestimento.amount === 0) {
      recommendations.push({
        type: 'success', // Ícone verde para incentivar boas práticas
        title: 'Que tal começar a investir?',
        message: 'Notamos que você não investiu este mês. Tente guardar pelo menos 10% do seu salário assim que ele cair na conta. Pague a si mesmo primeiro!'
      });
    } else if (gastosInvestimento.amount >= (summary.monthIncome * 0.20)) {
      recommendations.push({
        type: 'success',
        title: 'Investidor focado!',
        message: 'Excelente! Você investiu 20% ou mais da sua renda este mês. O seu eu do futuro agradece!'
      });
    }
  }

  // REGRA 6: Elogio de Bom Comportamento Financeiro Geral
  if (summary.monthIncome > 0 && summary.monthExpense <= (summary.monthIncome * 0.5)) {
    recommendations.push({
      type: 'success', 
      title: 'Ótimo controle financeiro',
      message: 'Parabéns! Gastou metade (ou menos) dos seus ganhos este mês. Continue com esse ótimo hábito financeiro.'
    });
  }

  // FALLBACK: Se o utilizador for novo ou estiver com as finanças tão perfeitas que não ativou nada
  if (recommendations.length === 0 && summary.monthExpense > 0) {
     recommendations.push({
      type: 'success',
      title: 'Tudo dentro do normal',
      message: 'Os seus gastos estão bem distribuídos. Continue a registar tudo para manter o controle!'
    });
  }

  // REGRA EXTRA 1: Usuário esqueceu de cadastrar a renda
  if (summary.monthIncome === 0 && summary.monthExpense > 0) {
    recommendations.push({
      type: 'warning',
      title: 'Cadastre suas receitas',
      message: 'Você registrou despesas, mas ainda não adicionou nenhum ganho este mês. Registre o seu salário para ativarmos as análises!'
    });
  }

  // REGRA EXTRA 2: Regra dos 30% (Desejos e Estilo de Vida)
  if (summary.monthIncome > 0 && gastosDesejos > (summary.monthIncome * 0.30)) {
    recommendations.push({
      type: 'warning',
      title: 'Alerta de estilo de vida',
      message: 'Os seus gastos com lazer e compras ultrapassaram o limite ideal de 30% da sua renda. Cuidado para não comprometer o essencial!'
    });
  }

  // REGRA EXTRA 3: Foco na Reserva de Emergência
  if (summary.monthIncome > 0 && gastosInvestimento.amount > 0) {
    recommendations.push({
      type: 'success',
      title: 'Foque na Reserva de Emergência',
      message: 'Vimos que você está investindo! Dica: garanta primeiro que você tem uma reserva equivalente a 6 meses do seu custo de vida guardada em um local seguro.'
    });
  }

  return recommendations;
};

module.exports = {
  getRecommendations,
};