const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Adicionamos a importação do JWT
const userRepository = require('../repositories/userRepository');

const registerUser = async (name, email, password) => {
  // ... (mantenha o código do registerUser exatamente como estava)
};

const loginUser = async (email, password) => {
  // 1. Verifica se o usuário existe no banco de dados
  const user = await userRepository.findByEmail(email);
  if (!user) {
    // Boa prática de segurança: Não diga "E-mail não encontrado", diga "Credenciais inválidas"
    // Assim, um invasor não descobre quais e-mails estão cadastrados na sua base.
    throw new Error('Credenciais inválidas.'); 
  }

  // 2. Compara a senha enviada (texto limpo) com o hash salvo no banco
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Credenciais inválidas.');
  }

  // 3. Se a senha estiver correta, geramos o Token JWT
  // Colocamos o ID do usuário dentro do token (payload) para sabermos quem ele é nas próximas requisições
  const token = jwt.sign(
    { userId: user.id }, 
    process.env.JWT_SECRET, // A chave secreta que está no seu .env
    { expiresIn: '1d' }     // O token expira em 1 dia
  );

  // 4. Retornamos o token e os dados do usuário (mas NUNCA devolva a senha!)
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  };
};

module.exports = {
  registerUser,
  loginUser, // Não esqueça de exportar a nova função
};