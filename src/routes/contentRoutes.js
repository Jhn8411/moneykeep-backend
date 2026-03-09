const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Se quiser que apenas usuários logados vejam os conteúdos:
router.use(authMiddleware);

// Rota GET para listar todos (agrupados) - http://localhost:3000/api/contents
router.get('/', contentController.getAll);

// Rota GET para buscar um conteúdo específico - http://localhost:3000/api/contents/ID_DO_CONTEUDO
router.get('/:id', contentController.getById);

module.exports = router;