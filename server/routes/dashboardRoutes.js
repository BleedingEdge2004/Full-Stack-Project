const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    getMonthlyRevenue,
    getProductBreakdown,
    getRegionSales,
    getSalesFunnel
} = require('../controllers/dashboardController');

//Dashboard APIs 
router.get('/monthly-revenue', protect, getMonthlyRevenue);
router.get('/product-breakdown', protect, getProductBreakdown);
router.get('/region-sales', protect, getRegionSales);
router.get('/sales-funnel', protect, getSalesFunnel);

module.exports = router ;