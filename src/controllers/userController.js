const userService = require('../services/userService');

const register = async (req, res) => {
  // ... (mantenha o código do register como estava)
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    // Chama o serviço de login
    const loginData = await userService.loginUser(email, password);

    // Retorna o sucesso (Status 200 OK)
    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      token: loginData.token,
      user: loginData.user
    });

  } catch (error) {
    // Se for erro de senha ou email incorreto (que disparamos no service)
    if (error.message === 'Credenciais inválidas.') {
      return res.status(401).json({ error: error.message }); // 401 Unauthorized
    }

    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

module.exports = {
  register,
  login, // Exportando a nova função
};