const userService = require('../services/userService');
const db = require('../config/db'); // IMPORTANTE: Precisamos importar a conexão com o banco aqui para o update e delete funcionarem!

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validação: Garante que o usuário preencheu tudo
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
    }

    // 2. Chama a camada de serviço para fazer o trabalho pesado (criptografar senha e salvar no banco)
    // Assumindo que seu userService tem uma função chamada registerUser (ou createUser)
    const newUser = await userService.registerUser(name, email, password);

    // 3. Retorna sucesso! (Status 201 significa "Created" / Criado)
    return res.status(201).json({
      message: 'Conta criada com sucesso!',
      user: newUser
    });

  } catch (error) {
    // 4. Tratamento de erros
    // Se o serviço avisar que o e-mail já existe, repassamos esse aviso para o frontend
    if (error.message === 'E-mail já cadastrado.') {
      return res.status(400).json({ error: error.message });
    }
    
    // Se for um erro desconhecido ou falha no banco de dados
    console.error('Erro no cadastro:', error);
    return res.status(500).json({ error: 'Erro interno no servidor ao tentar cadastrar.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    const loginData = await userService.loginUser(email, password);

    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      token: loginData.token,
      user: loginData.user
    });

  } catch (error) {
    if (error.message === 'Credenciais inválidas.') {
      return res.status(401).json({ error: error.message });
    }
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

const updateName = async (req, res) => {
  try {
    const { name } = req.body;
    
    // A CORREÇÃO ESTÁ AQUI: Mudamos de req.userId para req.user.id
    const userId = req.user.id; 

    if (!name) {
      return res.status(400).json({ error: 'O nome é obrigatório.' });
    }

    // Altera direto na tabela users do PostgreSQL
    const result = await db.query(
      'UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, email',
      [name, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar nome:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// Função para DELETAR a conta do usuário no Banco
const deleteAccount = async (req, res) => {
  try {
    // A CORREÇÃO AQUI TAMBÉM:
    const userId = req.user.id;

    const result = await db.query('DELETE FROM users WHERE id = $1', [userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    return res.status(200).json({ message: 'Conta excluída com sucesso do banco de dados.' });
  } catch (error) {
    console.error('Erro ao excluir conta:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = {
  register,
  login,
  updateName,
  deleteAccount
};