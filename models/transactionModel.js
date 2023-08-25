const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    accountNumber: Number,
    type: String, // "credit" ou "debit"
    amount: Number,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
