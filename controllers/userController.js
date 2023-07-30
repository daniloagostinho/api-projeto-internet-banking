const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const crypto = require('crypto');
const nodemailer = require('nodemailer');

require('dotenv').config();

const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

class UserController {
    static async register(req, res) {
        try {
            const { name, email, password, cpf } = req.body;

            // Aqui poderia ter validações dos campos recebidos no req.body

            let existingUser = await User.findOne({ email });
            let existingCPF = await User.findOne({ cpf });
            
            if (existingUser) {
                return res.status(400).json({ error: 'Email já cadastrado na base!' });
            }

            if (existingCPF) {
                return res.status(400).json({ error: 'CPF já cadastrado na base!' });
            }

            let user = await User.create({
                name,
                email,
                cpf,
                password,
                identityPhoto: req.file.path
            });

            let token = jwt.sign({ id: user._id }, JWT_SECRET);
            res.json({ token });

        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    static async login(req, res) {
        try {
            let user = await User.findOne({ email: req.body.email });
            if (!user) {
                res.json({ mensagem: 'Usuário não encontrado' });
                throw new Error('Usuário não encontrado');
            }
            let match = await bcrypt.compare(req.body.password, user.password);
            if (!match) {
                return res.json({ mensagem: 'Senha inválida' });
            }
            let token = jwt.sign({ id: user._id }, JWT_SECRET);
            res.json({ token });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    static async recover(req, res) {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(400).json({ messagem: 'Email não encontrado' });
            }

            // Gere um token de reset de senha
            user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
            await user.save();

            // Enviar email de recuperação de senha
            const transporter = nodemailer.createTransport({
                service: 'Outlook365',
                auth: {
                    user: EMAIL_USERNAME,
                    pass: EMAIL_PASSWORD
                }
            });

            const mailOptions = {
                to: user.email,
                from: EMAIL_USERNAME,
                subject: 'Recuperação de senha',
                text: `Clique no link a seguir ou cole-o em seu navegador para concluir o processo: \n\nhttp://${req.headers.host}/user/reset\n\n Se você não solicitou isso, ignore este e-mail e sua senha permanecerá inalterada. \n`
            };

            transporter.sendMail(mailOptions, (err) => {
                if (err) {
                    console.log(err); // Adicione essa linha
                    return res.status(500).json({ error: 'Não foi possível enviar o e-mail de recuperação!' });
                }
                res.json({ message: 'E-mail de recuperação enviado', resetPassWordToken: user.resetPasswordToken });
            });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async resetPassword(req, res) {
        try {
            const user = await User.findOne({
                resetPasswordToken: req.body.token,
                resetPasswordExpires: { $gt: Date.now() }
            });

            if (!user) {
                return res.status(400).json({ error: 'Token de reset da senha inválido ou expirado!' });
            }

            // Set the new password
            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            await user.save();

            res.json({ message: 'Senha resetada com sucesso!' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async sendVerificationCode(req, res) {
        try {
            let user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(400).json({ error: 'Usuário não encontrado' });
            }
            // Gerar um código de verificação aleatório
            let verificationCode = Math.floor(1000 + Math.random() * 9000);

            // Configurar o cliente Nodemailer
            let transporter = nodemailer.createTransport({
                service: 'Outlook365', // Seu serviço de email aqui
                auth: {
                    user: EMAIL_USERNAME,
                    pass: EMAIL_PASSWORD
                }
            });

            // Enviar o código de verificação via email
            await transporter.sendMail({
                from: EMAIL_USERNAME,
                to: user.email,
                subject: 'Código de Verificação',
                text: `Seu código de verificação é: ${verificationCode}`,
            });
            // Salvar o código de verificação no usuário
            user.emailVerificationCode = verificationCode;
            await user.save();

            res.json({ message: 'Código de verificação enviado com sucesso' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async validateVerificationCode(req, res) {
        try {
            let user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(400).json({ error: 'Usuário não encontrado' });
            }
            if (req.body.verificationCode !== user.emailVerificationCode) {
                return res.status(400).json({ error: 'Código de verificação inválido' });
            }
            // Caso o código de verificação esteja correto, marcamos o email como verificado
            user.emailVerified = true;
            user.emailVerificationCode = undefined; // Limpar o código de verificação
            await user.save();

            res.json({ message: 'Email verificado com sucesso' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = UserController;
