const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware'); // O middleware que checa o Token

// Rotas Públicas (Não precisam de token)
router.post('/register', userController.register);
router.post('/login', userController.login);

// Rotas Protegidas (Precisam do token enviado no Header)
// Usamos PUT para atualizar e DELETE para apagar
router.put('/', authMiddleware, userController.updateName);
router.delete('/', authMiddleware, userController.deleteAccount);

module.exports = router;