// Rotas de Sessoes
// Todas as rotas sao protegidas (requer autenticacao)

const express = require('express');
const router = express.Router();

const SessaoController = require('../controllers/SessaoController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

// Aplicar autenticacao em todas as rotas
router.use(authMiddleware);

// GET /api/sessoes - Listar todas
router.get('/', SessaoController.findAll);

// GET /api/sessoes/:id - Buscar por ID
router.get('/:id', SessaoController.find);

// POST /api/sessoes - Criar nova
router.post('/', SessaoController.create);

// PUT /api/sessoes/:id - Atualizar
router.put('/:id', SessaoController.update);

// DELETE /api/sessoes/:id - Excluir
router.delete('/:id', SessaoController.delete);

module.exports = router;
