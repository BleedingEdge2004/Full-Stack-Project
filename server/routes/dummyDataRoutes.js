const express = require('express');
const router = express.Router();
const { insertDummySales } = require('../controllers/dummyDataController');
const { protect } = require('../middlewares/authMiddleware');

// Protected Route: Insert dummy sales
router.get('/dummy', protect, insertDummySales);

module.exports = router;