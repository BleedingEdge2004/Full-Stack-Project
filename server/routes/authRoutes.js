const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { register, login, getSalespersons } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/salespersons', protect,  getSalespersons);

module.exports = router;