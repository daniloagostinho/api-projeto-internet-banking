const mongoose = require('mongoose');

const VerificationSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    code: { type: String, required: true },
});

module.exports = mongoose.model('Verification', VerificationSchema);
