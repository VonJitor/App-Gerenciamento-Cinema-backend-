require('dotenv').config();
const express = require('express');
const config = require('./config.js');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

// PRE-CONFIGURACAO
app.use(express.json()); // parser dados de requisicoes em JSON
app.use(cookieParser()); // parser de cookies

// CORS - permite credenciais (cookies) apenas do frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true, // permite envio de cookies
  })
);

// BANCO DE DADOS
const conexao = require('./app/models'); // inicializa a config do BD com sequelize

// ROTAS
app.get('/', (request, response) => {
  response.json({
    message: 'CineManager API',
    version: '1.0',
    descricao: 'Sistema de Gestão de Cinema',
  });
});

// Rotas de autenticacao
const authRotas = require('./app/routes/auth.routes.js');
app.use('/api/auth', authRotas);

// Rotas de recursos protegidos
const salaRotas = require('./app/routes/sala.routes.js');
const sessaoRotas = require('./app/routes/sessao.routes.js');
const produtoRotas = require('./app/routes/produto.routes.js');
const usuarioRotas = require('./app/routes/usuario.routes.js');
app.use('/api/salas', salaRotas);
app.use('/api/sessoes', sessaoRotas);
app.use('/api/produtos', produtoRotas);
app.use('/api/usuarios', usuarioRotas);

// MIDDLEWARE GLOBAL DE TRATAMENTO DE ERROS
app.use((err, req, res, next) => {
  console.error('Erro capturado:', err.message);

  // Erro de validação do Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Erro de validação',
      errors: err.errors.map(e => e.message),
    });
  }

  // Erro de constraint única do Sequelize
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      message: 'Registro duplicado',
      errors: err.errors.map(e => e.message),
    });
  }

  // Erro JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Token inválido',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expirado',
    });
  }

  // Erro genérico
  return res.status(500).json({
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// RODANDO SERVER
app.listen(config.port, () => {
  console.log(`CineManager API rodando na porta ${config.port}`);
});
