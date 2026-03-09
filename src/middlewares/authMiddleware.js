const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 1. O frontend envia o token pelo cabeçalho (header) chamado 'Authorization'
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido. Acesso negado.' });
  }

  // 2. O padrão da web é enviar o token assim: "Bearer eyJhbGciOi..."
  // Então nós separamos a palavra "Bearer" do token em si
  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Erro de formatação do token.' });
  }

  const token = parts[1];

  try {
    // 3. Verifica se o token é válido usando a nossa chave secreta do .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Pulo do gato: Pegamos o 'userId' que guardamos lá no login e injetamos na requisição!
    // Toda rota que usar esse middleware terá acesso a 'req.user.id' automaticamente.
    req.user = { id: decoded.userId };
    
    // 5. A pulseira é válida! 'next()' manda a requisição seguir para o Controller.
    return next();
    
  } catch (error) {
    // Se o token for inventado, adulterado ou estiver expirado (passou de 1 dia), cai aqui.
    return res.status(401).json({ error: 'Token inválido ou expirado. Faça login novamente.' });
  }
};

module.exports = authMiddleware;