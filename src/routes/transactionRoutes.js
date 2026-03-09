const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ao usar o middleware aqui em cima, TODAS as rotas abaixo dele exigirão o Token JWT!
router.use(authMiddleware);

// Rota POST: http://localhost:3000/api/transactions
router.post('/', transactionController.create);

// Rota GET: http://localhost:3000/api/transactions
router.get('/', transactionController.getAll);

module.exports = router;