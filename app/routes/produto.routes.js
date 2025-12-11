// Rotas de Produtos (Bomboniere)
// Todas as rotas sao protegidas (requer autenticacao)

const express = require('express');
const router = express.Router();

const ProdutoController = require('../controllers/ProdutoController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

// Aplicar autenticacao em todas as rotas
router.use(authMiddleware);

// GET /api/produtos - Listar todos
router.get('/', ProdutoController.findAll);

// GET /api/produtos/:id - Buscar por ID
router.get('/:id', ProdutoController.find);

// POST /api/produtos - Criar novo
router.post('/', ProdutoController.create);

// PUT /api/produtos/:id - Atualizar
router.put('/:id', ProdutoController.update);

// DELETE /api/produtos/:id - Excluir
router.delete('/:id', ProdutoController.delete);

module.exports = router;
