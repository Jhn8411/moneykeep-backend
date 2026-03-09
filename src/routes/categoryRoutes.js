const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protegendo a rota com JWT
router.use(authMiddleware);

// Rota GET: http://localhost:3000/api/categories
router.get('/', categoryController.getAll);

module.exports = router;