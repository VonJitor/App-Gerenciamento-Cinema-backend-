// Rotas de autenticacao
// POST /api/auth/register - Registrar novo usuario
// POST /api/auth/login - Login
// POST /api/auth/logout - Logout
// GET /api/auth/me - Obter dados do usuario logado

const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

// Rotas publicas (sem autenticacao)
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);

// Rotas protegidas (requer autenticacao)
router.get('/me', authMiddleware, AuthController.me);

module.exports = router;
