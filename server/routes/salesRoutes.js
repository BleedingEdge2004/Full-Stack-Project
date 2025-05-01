const express = require('express');
const router = express.Router();
const { createSale, getAllSales } = require('../controllers/salesController');
const { protect } = require('../middlewares/authMiddleware');

//Add new sale (only logged-in users)
router.post('/add', protect, createSale);

//Get all slaes (only logged-in users)
router.get('/all', protect, getAllSales);
module.exports = router;