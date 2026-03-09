const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rota de Cadastro
router.post('/register', userController.register);

// Nova Rota de Login (Ex: http://localhost:3000/api/users/login)
router.post('/login', userController.login);

module.exports = router;