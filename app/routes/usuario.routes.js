// Rotas de Usuarios
// CRUD completo protegido por autenticacao

const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

// Todas as rotas requerem autenticacao
router.use(authMiddleware);

// GET /api/usuarios - Listar todos
router.get('/', UsuarioController.findAll);

// GET /api/usuarios/:id - Buscar por ID
router.get('/:id', UsuarioController.find);

// PUT /api/usuarios/:id - Atualizar
router.put('/:id', UsuarioController.update);

// DELETE /api/usuarios/:id - Excluir
router.delete('/:id', UsuarioController.delete);

module.exports = router;
