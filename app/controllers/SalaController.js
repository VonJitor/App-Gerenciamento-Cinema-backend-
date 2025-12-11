// Controller de Salas
// CRUD completo para gerenciamento de salas do cinema

const Ajv = require('ajv');
const ajvErrors = require('ajv-errors');

const ajv = new Ajv({ allErrors: true });
ajvErrors(ajv);

const salaSchema = require('../schemas/sala.schema.js');
const validarSala = ajv.compile(salaSchema);

const models = require('../models/index.js');
const Sala = models.sala.Sala;

class SalaController {
    // GET /api/salas - Listar todas as salas
    async findAll(req, res) {
        try {
            const salas = await Sala.findAll();
            return res.status(200).json(salas);
        } catch (error) {
            console.error('Erro ao listar salas:', error);
            return res.status(500).json({
                message: 'Erro ao listar salas',
            });
        }
    }

    // GET /api/salas/:id - Buscar sala por ID
    async find(req, res) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: 'ID invalido',
            });
        }

        try {
            const sala = await Sala.findByPk(id);

            if (!sala) {
                return res.status(404).json({
                    message: 'Sala nao encontrada',
                });
            }

            return res.status(200).json(sala);
        } catch (error) {
            console.error('Erro ao buscar sala:', error);
            return res.status(500).json({
                message: 'Erro ao buscar sala',
            });
        }
    }

    // POST /api/salas - Criar nova sala
    async create(req, res) {
        // Validar dados de entrada
        const valido = validarSala(req.body);
        if (!valido) {
            const erro = validarSala.errors[0];
            return res.status(400).json({
                message: erro.message || 'Dados invalidos',
            });
        }

        try {
            const sala = await Sala.create(req.body);
            return res.status(201).json(sala);
        } catch (error) {
            console.error('Erro ao criar sala:', error);
            return res.status(500).json({
                message: 'Erro ao criar sala',
            });
        }
    }

    // PUT /api/salas/:id - Atualizar sala
    async update(req, res) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: 'ID invalido',
            });
        }

        // Validar dados de entrada
        const valido = validarSala(req.body);
        if (!valido) {
            const erro = validarSala.errors[0];
            return res.status(400).json({
                message: erro.message || 'Dados invalidos',
            });
        }

        try {
            // Verificar se sala existe
            const salaExiste = await Sala.findByPk(id);
            if (!salaExiste) {
                return res.status(404).json({
                    message: 'Sala nao encontrada',
                });
            }

            // Atualizar
            const atualizado = await Sala.update(req.body, id);
            if (atualizado) {
                const salaAtualizada = await Sala.findByPk(id);
                return res.status(200).json(salaAtualizada);
            } else {
                return res.status(500).json({
                    message: 'Erro ao atualizar sala',
                });
            }
        } catch (error) {
            console.error('Erro ao atualizar sala:', error);
            return res.status(500).json({
                message: 'Erro ao atualizar sala',
            });
        }
    }

    // DELETE /api/salas/:id - Excluir sala
    async delete(req, res) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: 'ID invalido',
            });
        }

        try {
            const removido = await Sala.delete(id);

            if (removido) {
                return res.status(200).json({
                    message: 'Sala excluida com sucesso',
                });
            } else {
                return res.status(404).json({
                    message: 'Sala nao encontrada',
                });
            }
        } catch (error) {
            console.error('Erro ao excluir sala:', error);
            // Verificar se eh erro de constraint (sala tem sessoes)
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(400).json({
                    message: 'Nao eh possivel excluir sala com sessoes cadastradas',
                });
            }
            return res.status(500).json({
                message: 'Erro ao excluir sala',
            });
        }
    }
}

module.exports = new SalaController();
