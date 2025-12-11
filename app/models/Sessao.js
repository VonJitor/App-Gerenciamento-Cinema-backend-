// Model de Sessao do cinema
// Campos: id, filme, horario_inicio, valor_ingresso_base, sala_id (FK)

const Sequelize = require('sequelize');
const db = require('./conexao.js');

class Sessao {
    // Busca sessao por ID com dados da sala
    static async findByPk(id, includeSala = true) {
        try {
            const options = includeSala ? { include: ['Sala'] } : {};
            const resultado = await SessaoModel.findByPk(id, options);
            return resultado || null;
        } catch (error) {
            throw error;
        }
    }

    // Lista todas as sessoes com dados das salas
    static async findAll(includeSala = true) {
        try {
            const resultados = await SessaoModel.findAll({
                include: includeSala ? ['Sala'] : [],
                order: [['horario_inicio', 'ASC']], // ordena por horario
            });
            return resultados || [];
        } catch (error) {
            throw error;
        }
    }

    // Cria nova sessao
    static async create(novaSessao) {
        try {
            const sessao = await SessaoModel.create({
                filme: novaSessao.filme,
                horario_inicio: novaSessao.horario_inicio,
                valor_ingresso_base: novaSessao.valor_ingresso_base,
                sala_id: novaSessao.sala_id,
            });
            return sessao;
        } catch (error) {
            throw error;
        }
    }

    // Atualiza sessao
    static async update(dados, idSessao) {
        try {
            const resultado = await SessaoModel.update(dados, {
                where: { id: idSessao },
            });
            return resultado[0] > 0;
        } catch (error) {
            throw error;
        }
    }

    // Deleta sessao
    static async delete(id) {
        try {
            const data = await SessaoModel.findByPk(id);
            if (data) {
                await data.destroy();
                return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    }

    // Calcula os precos de ingresso (Inteira, Meia, Cortesia)
    static calcularPrecos(valorBase) {
        const base = parseFloat(valorBase);
        return {
            inteira: base.toFixed(2),
            meia: (base * 0.5).toFixed(2),
            cortesia: '0.00',
        };
    }
}

// Definicao do modelo Sequelize
const SessaoModel = db.define('Sessao', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    filme: {
        type: Sequelize.STRING(200),
        allowNull: false,
        comment: 'Titulo do filme em exibicao',
    },
    horario_inicio: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'Data e hora de inicio da sessao',
    },
    valor_ingresso_base: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0, // valor nao pode ser negativo
        },
        comment: 'Valor base do ingresso (inteira)',
    },
    sala_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Sala',
            key: 'id',
        },
        comment: 'FK para a sala onde ocorre a sessao',
    },
});

module.exports = { Sessao, SessaoModel };
