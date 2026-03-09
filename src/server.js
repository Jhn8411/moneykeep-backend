const app = require('./app');
const db = require('./config/db'); // Importamos a nossa ligação à base de dados

const PORT = process.env.PORT || 3000;

// Criamos uma função assíncrona para iniciar o sistema
const startServer = async () => {
  try {
    // 1. Testamos a ligação fazendo uma query simples que pede a hora atual ao PostgreSQL
    const res = await db.query('SELECT NOW()');
    console.log('✅ Base de dados ligada com sucesso!');
    console.log(`⏱️  Hora no servidor da Base de Dados: ${res.rows[0].now}`);

    // 2. Só iniciamos o servidor Express SE a base de dados conectar com sucesso
    app.listen(PORT, () => {
      console.log(`🚀 Servidor a correr na porta ${PORT}`);
      console.log(`🌐 Aceda a: http://localhost:${PORT}`);
    });

  } catch (error) {
    // Se as credenciais estiverem erradas ou o PostgreSQL estiver desligado, cai aqui
    console.error('❌ Erro Fatal: Não foi possível conectar à base de dados.');
    console.error('Detalhe do erro:', error.message);
    process.exit(1); // Encerra a aplicação com código de erro
  }
};

// Executamos a função
startServer();