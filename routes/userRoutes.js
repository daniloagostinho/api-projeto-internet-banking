/**
 * @swagger
 * definitions:
 *   User:
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       cpf:
 *         type: string
 *       password:
 *         type: string
 *       resetPasswordToken:
 *         type: string
 *       resetPasswordExpires:
 *         type: date
 *       emailVerificationCode:
 *         type: number
 *   Verification:
 *     properties:
 *       email:
 *         type: string
 *       code:
 *         type: string
 *  
 * /register:
 *   post:
 *     summary: Registra um novo usuário
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: O usuário a ser criado
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: Retorno do token de autenticação do usuário
 *       400:
 *         description: Erro ao registrar
 *  
 * /login:
 *   post:
 *     summary: Faz login do usuário
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: login
 *         description: CPF e senha do usuário para fazer login
 *         schema:
 *           type: object
 *           required:
 *             - cpf
 *             - password
 *           properties:
 *             cpf:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Retorno do token de autenticação do usuário
 *       400:
 *         description: Erro ao fazer login
 *  
 * /recover:
 *   post:
 *     summary: Recupera a senha do usuário
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: recover
 *         description: E-mail do usuário para recuperação de senha
 *         schema:
 *           type: object
 *           required:
 *             - email
 *           properties:
 *             email:
 *               type: string
 *     responses:
 *       200:
 *         description: E-mail de recuperação enviado
 *       400:
 *         description: Erro na recuperação da senha
 *  
 * /reset:
 *   post:
 *     summary: Reseta a senha do usuário
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: reset
 *         description: Token e nova senha para reset
 *         schema:
 *           type: object
 *           required:
 *             - token
 *             - password
 *           properties:
 *             token:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Senha resetada com sucesso
 *       400:
 *         description: Erro ao resetar a senha
 *  
 * /send/code-verification:
 *   post:
 *     summary: Envia código de verificação para o usuário
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: sendCode
 *         description: E-mail para enviar código de verificação
 *         schema:
 *           type: object
 *           required:
 *             - email
 *           properties:
 *             email:
 *               type: string
 *     responses:
 *       200:
 *         description: Código de verificação enviado
 *       500:
 *         description: Erro ao enviar o código
 *  
 * /validate/verification-code:
 *   post:
 *     summary: Valida o código de verificação do usuário
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: validateCode
 *         description: E-mail e código de verificação para validação
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - code
 *           properties:
 *             email:
 *               type: string
 *             code:
 *               type: string
 *     responses:
 *       200:
 *         description: Email verificado com sucesso
 *       400:
 *         description: Erro ao validar o código
 *       500:
 *         description: Erro na validação
 */


const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/recover', userController.recover);
router.post('/reset', userController.resetPassword);
router.post('/send/code-verification', userController.sendVerificationCode)
router.post('/validate/verification-code', userController.validateVerificationCode)

module.exports = router;
