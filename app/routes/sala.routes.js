// Rotas de Salas
// Todas as rotas sao protegidas (requer autenticacao)

const express = require('express');
const router = express.Router();

const SalaController = require('../controllers/SalaController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

// Aplicar autenticacao em todas as rotas
router.use(authMiddleware);

// GET /api/salas - Listar todas
router.get('/', SalaController.findAll);

// GET /api/salas/:id - Buscar por ID
router.get('/:id', SalaController.find);

// POST /api/salas - Criar nova
router.post('/', SalaController.create);

// PUT /api/salas/:id - Atualizar
router.put('/:id', SalaController.update);

// DELETE /api/salas/:id - Excluir
router.delete('/:id', SalaController.delete);

module.exports = router;
