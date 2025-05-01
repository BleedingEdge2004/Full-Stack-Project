const Sale = require('../models/Sales');

// Monthly Revenue for Line Chart
exports.getMonthlyRevenue = async (req, res) => {
    try {
        const { month } = req.query;

        const matchStage = {};

        if (req.user.role === 'Salesperson') {
            matchStage.salesperson = req.user._id;
        }

        if (month) {
            matchStage.month = parseInt(month);
        }

        if (req.query.month) {
            matchStage.month = parseInt(req.query.month);
        }
        if (req.query.region) {
            matchStage.region = req.query.region;
        }
        if (req.query.category) {
            matchStage.category = req.query.category;
        }
        if (req.query.salesperson) {
            matchStage.salesperson = req.query.salesperson;
        }
        if (req.query.startDate || req.query.endDate) {
            matchStage.createdAt = {};
            if (req.query.startDate) {
                matchStage.createdAt.$gte = new Date(req.query.startDate);
            }
            if (req.query.endDate) {
                matchStage.createdAt.$lte = new Date(req.query.endDate);
            }
        }
        const revenue = await Sale.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$month',
                    totalRevenue: { $sum: '$amount' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json(revenue);
    } catch (err) {
        console.error('Error getting monthly revenue:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


// Product Breakdown for Pie Chart
exports.getProductBreakdown = async (req, res) => {
    try {
        const matchStage = {};

        if (req.user.role === 'Salesperson') {
            matchStage.salesperson = req.user._id;
        }
        if (req.query.month) {
            matchStage.month = parseInt(req.query.month);
        }
        if (req.query.region) {
            matchStage.region = req.query.region;
        }
        if (req.query.category) {
            matchStage.category = req.query.category;
        }
        if (req.query.salesperson) {
            matchStage.salesperson = req.query.salesperson;
        }
        if (req.query.startDate || req.query.endDate) {
            matchStage.createdAt = {};
            if (req.query.startDate) {
                matchStage.createdAt.$gte = new Date(req.query.startDate);
            }
            if (req.query.endDate) {
                matchStage.createdAt.$lte = new Date(req.query.endDate);
            }
        }

        const productData = await Sale.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$category',
                    totalRevenue: { $sum: '$amount' }
                }
            }
        ]);

        res.json(productData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error - Product Breakdown' });
    }
};

// Region Sales for Heat Map
exports.getRegionSales = async (req, res) => {
    try {
        const { region } = req.query;

        const matchStage = {};

        if (req.user.role === 'Salesperson') {
            matchStage.salesperson = req.user._id;
        }

        if (region) {
            matchStage.region = region;
        }
        if (req.query.month) {
            matchStage.month = parseInt(req.query.month);
        }
        if (req.query.region) {
            matchStage.region = req.query.region;
        }
        if (req.query.category) {
            matchStage.category = req.query.category;
        }
        if (req.query.salesperson) {
            matchStage.salesperson = req.query.salesperson;
        }
        if (req.query.startDate || req.query.endDate) {
            matchStage.createdAt = {};
            if (req.query.startDate) {
                matchStage.createdAt.$gte = new Date(req.query.startDate);
            }
            if (req.query.endDate) {
                matchStage.createdAt.$lte = new Date(req.query.endDate);
            }
        }
        const sales = await Sale.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$region',
                    totalRevenue: { $sum: '$amount' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json(sales);
    } catch (err) {
        console.error('Error getting region sales:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Sales Funnel Visualization
exports.getSalesFunnel = async (req, res) => {
    try {
        const matchStage = {};

        if (req.user.role === 'Salesperson') {
            matchStage.salesperson = req.user._id;
        }
        if (req.query.month) {
            matchStage.month = parseInt(req.query.month);
        }
        if (req.query.region) {
            matchStage.region = req.query.region;
        }
        if (req.query.category) {
            matchStage.category = req.query.category;
        }
        if (req.query.salesperson) {
            matchStage.salesperson = req.query.salesperson;
        }
        if (req.query.startDate || req.query.endDate) {
            matchStage.createdAt = {};
            if (req.query.startDate) {
                matchStage.createdAt.$gte = new Date(req.query.startDate);
            }
            if (req.query.endDate) {
                matchStage.createdAt.$lte = new Date(req.query.endDate);
            }
        }
        const totalVisitors = await Sale.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalVisitors: { $sum: '$visitorCount' }
                }
            }
        ]);

        const totalOrders = await Sale.countDocuments(matchStage);

        const visitors = totalVisitors[0]?.totalVisitors || 0;
        const conversionRate = visitors ? (totalOrders / visitors) * 100 : 0;

        res.json({
            totalVisitors: visitors,
            totalOrders,
            conversionRate: conversionRate.toFixed(2) + '%'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error - Sales Funnel' });
    }
};
