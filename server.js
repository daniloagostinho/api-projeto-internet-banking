const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

const app = express();
app.use(cors());

// Conectando ao MongoDB
mongoose.connect(``)
    .then(() => console.log('Conectado ao MongoDB com sucesso!'));

app.use(express.json());

// Usando as rotas do usuário
app.use('/user', userRoutes);

app.listen(3000, () => console.log('Servidor rodando na porta: 3000'));
