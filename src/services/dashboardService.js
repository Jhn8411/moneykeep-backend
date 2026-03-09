const dashboardRepository = require('../repositories/dashboardRepository');

const getMonthlySummary = async (userId, queryMonth, queryYear) => {
  // Se o frontend não enviar mês/ano na pesquisa, assumimos a data atual do servidor
  const currentDate = new Date();
  const month = queryMonth ? parseInt(queryMonth) : currentDate.getMonth() + 1; // getMonth() começa no 0 (Janeiro)
  const year = queryYear ? parseInt(queryYear) : currentDate.getFullYear();

  const summary = await dashboardRepository.getSummary(userId, month, year);
  
  return summary;
};

const getExpensesByCategorySummary = async (userId, queryMonth, queryYear) => {
  const currentDate = new Date();
  const month = queryMonth ? parseInt(queryMonth) : currentDate.getMonth() + 1;
  const year = queryYear ? parseInt(queryYear) : currentDate.getFullYear();

  // 1. Busca as despesas agrupadas do banco
  const expenses = await dashboardRepository.getExpensesByCategory(userId, month, year);

  // 2. Calcula o total geral de despesas no mês para podermos descobrir a porcentagem
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // 3. Adiciona a porcentagem em cada categoria
  const expensesWithPercentage = expenses.map(expense => {
    // Evita divisão por zero caso o total seja 0
    const percentage = totalExpense > 0 ? (expense.amount / totalExpense) * 100 : 0;
    
    return {
      category: expense.categoryName,
      amount: expense.amount,
      percentage: Math.round(percentage) // Arredonda para não ficar 33.333333%
    };
  });

  return expensesWithPercentage;
};

const getAnnualOverviewSummary = async (userId, queryYear) => {
  const currentDate = new Date();
  const year = queryYear ? parseInt(queryYear) : currentDate.getFullYear();

  // 1. Busca os dados reais da base de dados
  const dbData = await dashboardRepository.getAnnualOverview(userId, year);

  // 2. Estrutura base dos 12 meses (exatamente como está no seu Figma)
  const monthsStr = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  // 3. Cria um array com os 12 meses preenchidos a zero
  const annualData = monthsStr.map((monthName, index) => {
    const monthNumber = index + 1; // Janeiro é 1, Fevereiro é 2, etc.
    
    // Procura se a base de dados devolveu algo para este mês
    const monthData = dbData.find(data => data.month === monthNumber);

    return {
      month: monthName,
      income: monthData ? monthData.income : 0,
      expense: monthData ? monthData.expense : 0
      // Nota: No Figma, as despesas no gráfico de barras parecem ir para a zona negativa.
      // O frontend (Chart.js/Recharts) pode tratar o "expense" multiplicando por -1 se necessário,
      // mas na API é boa prática enviar sempre o valor absoluto e deixar a View decidir a exibição.
    };
  });

  return annualData;
};

module.exports = {
  getMonthlySummary,
  getExpensesByCategorySummary,
  getAnnualOverviewSummary, // Exportar a nova função
};