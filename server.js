const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Conectando ao MongoDB
mongoose.connect('mongodb+srv://danilodev:091011@cluster0.w65a0yv.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB com sucesso!'));

app.use(express.json());

// Usando as rotas do usuário
app.use('/user', userRoutes);

app.listen(3000, () => console.log('Servidor rodando na porta: 3000'));
