const express = require('express');
const router = express.Router();
const recurringController = require('../controllers/recurringController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas exigem autenticação
router.use(authMiddleware);

router.post('/',    recurringController.create);   // Criar
router.get('/',     recurringController.getAll);   // Listar
router.put('/:id',  recurringController.update);   // Editar
router.delete('/:id', recurringController.remove); // Excluir

module.exports = router;
