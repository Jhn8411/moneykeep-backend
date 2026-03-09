const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

// Rota GET: http://localhost:3000/api/recommendations
router.get('/', recommendationController.generateUserRecommendations);

module.exports = router;