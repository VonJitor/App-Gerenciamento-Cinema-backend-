// Model de Sala do cinema
// Campos: id, nome, capacidade

const Sequelize = require('sequelize');
const db = require('./conexao.js');

class Sala {
    // Busca sala por ID
    static async findByPk(id) {
        try {
            const resultado = await SalaModel.findByPk(id);
            return resultado || null;
        } catch (error) {
            throw error;
        }
    }

    // Lista todas as salas
    static async findAll(include = null) {
        try {
            const options = include ? { include } : {};
            const resultados = await SalaModel.findAll(options);
            return resultados || [];
        } catch (error) {
            throw error;
        }
    }

    // Cria nova sala
    static async create(novaSala) {
        try {
            const sala = await SalaModel.create({
                nome: novaSala.nome,
                capacidade: novaSala.capacidade,
            });
            return sala;
        } catch (error) {
            throw error;
        }
    }

    // Atualiza sala
    static async update(dados, idSala) {
        try {
            const resultado = await SalaModel.update(dados, {
                where: { id: idSala },
            });
            return resultado[0] > 0;
        } catch (error) {
            throw error;
        }
    }

    // Deleta sala
    static async delete(id) {
        try {
            const data = await SalaModel.findByPk(id);
            if (data) {
                await data.destroy();
                return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    }
}

// Definicao do modelo Sequelize
const SalaModel = db.define('Sala', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    nome: {
        type: Sequelize.STRING(80),
        allowNull: false,
        comment: 'Nome ou numero da sala (ex: Sala 1, IMAX)',
    },
    capacidade: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min: 1, // capacidade minima de 1 assento
        },
        comment: 'Quantidade total de assentos',
    },
});

module.exports = { Sala, SalaModel };
