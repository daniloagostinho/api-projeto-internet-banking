const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

require('dotenv').config();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API do projeto Internet Banking',
            version: '1.0.0',
            description: 'Uma API de exemplo para demonstrar o uso do Swagger',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    // Path para os arquivos que contém as definições do Swagger
    apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);


const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

const app = express();
app.use(cors());

// Conectando ao MongoDB
mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.w65a0yv.mongodb.net/`, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Conectado ao MongoDB com sucesso!'));

app.use(express.json());

// Usando as rotas do usuário
app.use('/user', userRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(3000, () => console.log('Servidor rodando na porta: 3000'));
