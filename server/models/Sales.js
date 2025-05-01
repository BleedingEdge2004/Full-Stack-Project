const mongoose = require('mongoose');
const salesSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    category: { type: String },
    amount: { type: Number, required: true },
    quantity: { type: Number, required: true },
    region: { type: String },
    city: { type: String },
    month: { type: Number},
    visitorCount: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    salesperson: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });


const Sale = mongoose.model('Sale', salesSchema);
module.exports = Sale ;