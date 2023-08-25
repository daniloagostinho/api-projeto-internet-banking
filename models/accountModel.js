const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referência ao modelo de usuário
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    // ... outros campos ...
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
