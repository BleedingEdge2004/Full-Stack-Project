const Sale = require('../models/Sales')
//Create new sale
exports.createSale = async (req, res) => {
    const { productName, category, amount, quantity, region, city,month } = req.body;
    try {
        const sale = new Sale({
            productName,
            category,
            amount,
            quantity,
            region,
            city,
            month,
            salesperson: req.user._id       //from authMiddleware
        });
        const savedSale = await sale.save();
        res.status(201).json(savedSale);
    }
    catch (error) {
        res.status(500).json({ message: `Server error while creating sale` });
    }
};

//Get All Sales
exports.getAllSales = async (req, res) => {
    try {
        const sales = await Sale.find().populate('salesperson', 'name email role');
        res.json(sales);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: `Server error while fetchin gsales` });
    }
};