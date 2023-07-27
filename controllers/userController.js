const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    try {
        let existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email já cadastrado na base!' });
        }
        let user = await User.create(req.body);
        let token = jwt.sign({ id: user._id }, 'your_jwt_secret');
        res.json({ token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

exports.login = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.json({ mensagem: 'Usuário não encontrado' });
            throw new Error('Usuário não encontrado');
        }
        let match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            res.json({ mensagem: 'Senha inválida' });
            throw new Error('Senha inválida');
        }
        let token = jwt.sign({ id: user._id }, 'hdusahudhsahud');
        res.json({ token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
