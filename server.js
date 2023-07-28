const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

const app = express();

// Conectando ao MongoDB
mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.w65a0yv.mongodb.net/`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB com sucesso!'));

app.use(express.json());

// Usando as rotas do usuário
app.use('/user', userRoutes);

app.listen(3000, () => console.log('Servidor rodando na porta: 3000'));
