// Controller de Produtos (Bomboniere)
// CRUD completo para gerenciamento de produtos do cinema

const Ajv = require('ajv');
const ajvErrors = require('ajv-errors');

const ajv = new Ajv({ allErrors: true });
ajvErrors(ajv);

const produtoSchema = require('../schemas/produto.schema.js');
const validarProduto = ajv.compile(produtoSchema);

const models = require('../models/index.js');
const Produto = models.produto.Produto;

class ProdutoController {
    // GET /api/produtos - Listar todos os produtos
    async findAll(req, res) {
        try {
            const produtos = await Produto.findAll();
            return res.status(200).json(produtos);
        } catch (error) {
            console.error('Erro ao listar produtos:', error);
            return res.status(500).json({
                message: 'Erro ao listar produtos',
            });
        }
    }

    // GET /api/produtos/:id - Buscar produto por ID
    async find(req, res) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: 'ID invalido',
            });
        }

        try {
            const produto = await Produto.findByPk(id);

            if (!produto) {
                return res.status(404).json({
                    message: 'Produto nao encontrado',
                });
            }

            return res.status(200).json(produto);
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            return res.status(500).json({
                message: 'Erro ao buscar produto',
            });
        }
    }

    // POST /api/produtos - Criar novo produto
    async create(req, res) {
        // Validar dados de entrada
        const valido = validarProduto(req.body);
        if (!valido) {
            const erro = validarProduto.errors[0];
            return res.status(400).json({
                message: erro.message || 'Dados invalidos',
            });
        }

        try {
            const produto = await Produto.create(req.body);
            return res.status(201).json(produto);
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            return res.status(500).json({
                message: 'Erro ao criar produto',
            });
        }
    }

    // PUT /api/produtos/:id - Atualizar produto
    async update(req, res) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: 'ID invalido',
            });
        }

        // Validar dados de entrada
        const valido = validarProduto(req.body);
        if (!valido) {
            const erro = validarProduto.errors[0];
            return res.status(400).json({
                message: erro.message || 'Dados invalidos',
            });
        }

        try {
            // Verificar se produto existe
            const produtoExiste = await Produto.findByPk(id);
            if (!produtoExiste) {
                return res.status(404).json({
                    message: 'Produto nao encontrado',
                });
            }

            // Atualizar
            const atualizado = await Produto.update(req.body, id);
            if (atualizado) {
                const produtoAtualizado = await Produto.findByPk(id);
                return res.status(200).json(produtoAtualizado);
            } else {
                return res.status(500).json({
                    message: 'Erro ao atualizar produto',
                });
            }
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            return res.status(500).json({
                message: 'Erro ao atualizar produto',
            });
        }
    }

    // DELETE /api/produtos/:id - Excluir produto
    async delete(req, res) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: 'ID invalido',
            });
        }

        try {
            const removido = await Produto.delete(id);

            if (removido) {
                return res.status(200).json({
                    message: 'Produto excluido com sucesso',
                });
            } else {
                return res.status(404).json({
                    message: 'Produto nao encontrado',
                });
            }
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
            return res.status(500).json({
                message: 'Erro ao excluir produto',
            });
        }
    }
}

module.exports = new ProdutoController();
