const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Adicionamos a importação do JWT
const db = require('../config/db');
const userRepository = require('../repositories/userRepository');

const registerUser = async (name, email, password) => {
  // 1. Verifica se o e-mail já existe no banco de dados
  const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);

  if (userExists.rows.length > 0) {
    // Lança um erro que será capturado lá pelo userController
    throw new Error('E-mail já cadastrado.');
  }

  // 2. Criptografa a senha para segurança (Hashing)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3. Insere o novo usuário na tabela, salvando a senha criptografada
  const result = await db.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
    [name, email, hashedPassword]
  );

  // 4. Retorna os dados do usuário criados (sem a senha, por segurança)
  return result.rows[0];
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