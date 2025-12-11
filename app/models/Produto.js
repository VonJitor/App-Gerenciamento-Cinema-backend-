// Model de Produto da bomboniere
// Campos: id, nome, categoria, preco, estoque

const Sequelize = require('sequelize');
const db = require('./conexao.js');

class Produto {
    // Busca produto por ID
    static async findByPk(id) {
        try {
            const resultado = await ProdutoModel.findByPk(id);
            return resultado || null;
        } catch (error) {
            throw error;
        }
    }

    // Lista todos os produtos
    static async findAll() {
        try {
            const resultados = await ProdutoModel.findAll({
                order: [['categoria', 'ASC'], ['nome', 'ASC']], // ordena por categoria e nome
            });
            return resultados || [];
        } catch (error) {
            throw error;
        }
    }

    // Cria novo produto
    static async create(novoProduto) {
        try {
            const produto = await ProdutoModel.create({
                nome: novoProduto.nome,
                categoria: novoProduto.categoria,
                preco: novoProduto.preco,
                estoque: novoProduto.estoque || 0,
            });
            return produto;
        } catch (error) {
            throw error;
        }
    }

    // Atualiza produto
    static async update(dados, idProduto) {
        try {
            const resultado = await ProdutoModel.update(dados, {
                where: { id: idProduto },
            });
            return resultado[0] > 0;
        } catch (error) {
            throw error;
        }
    }

    // Deleta produto
    static async delete(id) {
        try {
            const data = await ProdutoModel.findByPk(id);
            if (data) {
                await data.destroy();
                return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    }

    // Atualiza estoque (adiciona ou remove)
    static async atualizarEstoque(id, quantidade) {
        try {
            const produto = await ProdutoModel.findByPk(id);
            if (!produto) return null;

            const novoEstoque = produto.estoque + quantidade;
            if (novoEstoque < 0) {
                throw new Error('Estoque insuficiente');
            }

            await produto.update({ estoque: novoEstoque });
            return produto;
        } catch (error) {
            throw error;
        }
    }
}

// Definicao do modelo Sequelize
const ProdutoModel = db.define('Produto', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    nome: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'Nome do produto (ex: Pipoca Grande)',
    },
    categoria: {
        type: Sequelize.ENUM('Pipoca', 'Bebida', 'Doce', 'Combo', 'Outros'),
        allowNull: false,
        comment: 'Categoria do produto',
    },
    preco: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0, // preco nao pode ser negativo
        },
        comment: 'Preco unitario do produto',
    },
    estoque: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0, // estoque nao pode ser negativo
        },
        comment: 'Quantidade em estoque',
    },
});

module.exports = { Produto, ProdutoModel };
