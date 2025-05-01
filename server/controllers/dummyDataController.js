const Sale = require('../models/Sales');

exports.insertDummySales = async (req, res) => {
    try {
        const salespersonId = req.user._id; // Get salesperson ID from logged-in user

        const dummySales = [
            { productName: 'Laptop', category: 'Electronics', amount: 1200, quantity: 5, region: 'North India', city: 'Delhi', month: 4, salesperson: salespersonId },
            { productName: 'T-shirt', category: 'Clothing', amount: 800, quantity: 10, region: 'South India', city: 'Bangalore', month: 4, salesperson: salespersonId },
            { productName: 'Sofa', category: 'Furniture', amount: 1500, quantity: 2, region: 'East India', city: 'Kolkata', month: 5, salesperson: salespersonId },
            { productName: 'Toy Car', category: 'Toys', amount: 300, quantity: 8, region: 'West India', city: 'Mumbai', month: 5, salesperson: salespersonId },
            { productName: 'Smartphone', category: 'Electronics', amount: 2500, quantity: 4, region: 'North India', city: 'Chandigarh', month: 6, salesperson: salespersonId },
            { productName: 'Jeans', category: 'Clothing', amount: 950, quantity: 7, region: 'South India', city: 'Chennai', month: 6, salesperson: salespersonId },
            { productName: 'Dining Table', category: 'Furniture', amount: 1800, quantity: 1, region: 'East India', city: 'Patna', month: 7, salesperson: salespersonId },
            { productName: 'Action Figure', category: 'Toys', amount: 400, quantity: 6, region: 'West India', city: 'Pune', month: 7, salesperson: salespersonId },
            { productName: 'Tablet', category: 'Electronics', amount: 1500, quantity: 3, region: 'North India', city: 'Lucknow', month: 8, salesperson: salespersonId },
            { productName: 'Jacket', category: 'Clothing', amount: 1300, quantity: 5, region: 'South India', city: 'Hyderabad', month: 8, salesperson: salespersonId }
        ];

        await Sale.insertMany(dummySales);

        res.status(201).json({ message: 'Dummy sales inserted successfully!' });
    } catch (error) {
        console.error('Error inserting dummy sales:', error);
        res.status(500).json({ message: 'Server error inserting dummy sales' });
    }
};
