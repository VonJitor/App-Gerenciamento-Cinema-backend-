// Controller de Sessoes
// CRUD completo para gerenciamento de sessoes de filmes

const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const ajvErrors = require('ajv-errors');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
ajvErrors(ajv);

const sessaoSchema = require('../schemas/sessao.schema.js');
const validarSessao = ajv.compile(sessaoSchema);

const models = require('../models/index.js');
const Sessao = models.sessao.Sessao;
const Sala = models.sala.Sala;

class SessaoController {
    // GET /api/sessoes - Listar todas as sessoes com dados da sala e precos
    async findAll(req, res) {
        try {
            const sessoes = await Sessao.findAll(true);

            // Adicionar calculo de precos em cada sessao
            const sessoesComPrecos = sessoes.map(sessao => {
                const precos = Sessao.calcularPrecos(sessao.valor_ingresso_base);
                return {
                    ...sessao.toJSON(),
                    precos: precos,
                };
            });

            return res.status(200).json(sessoesComPrecos);
        } catch (error) {
            console.error('Erro ao listar sessoes:', error);
            return res.status(500).json({
                message: 'Erro ao listar sessoes',
            });
        }
    }

    // GET /api/sessoes/:id - Buscar sessao por ID
    async find(req, res) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: 'ID invalido',
            });
        }

        try {
            const sessao = await Sessao.findByPk(id, true);

            if (!sessao) {
                return res.status(404).json({
                    message: 'Sessao nao encontrada',
                });
            }

            // Adicionar calculo de precos
            const precos = Sessao.calcularPrecos(sessao.valor_ingresso_base);
            const resultado = {
                ...sessao.toJSON(),
                precos: precos,
            };

            return res.status(200).json(resultado);
        } catch (error) {
            console.error('Erro ao buscar sessao:', error);
            return res.status(500).json({
                message: 'Erro ao buscar sessao',
            });
        }
    }

    // POST /api/sessoes - Criar nova sessao
    async create(req, res) {
        // Validar dados de entrada
        const valido = validarSessao(req.body);
        if (!valido) {
            const erro = validarSessao.errors[0];
            return res.status(400).json({
                message: erro.message || 'Dados invalidos',
            });
        }

        try {
            // Verificar se a sala existe
            const salaExiste = await Sala.findByPk(req.body.sala_id);
            if (!salaExiste) {
                return res.status(400).json({
                    message: 'Sala nao encontrada',
                });
            }

            const sessao = await Sessao.create(req.body);

            // Buscar sessao com dados da sala
            const sessaoCompleta = await Sessao.findByPk(sessao.id, true);
            const precos = Sessao.calcularPrecos(sessaoCompleta.valor_ingresso_base);

            return res.status(201).json({
                ...sessaoCompleta.toJSON(),
                precos: precos,
            });
        } catch (error) {
            console.error('Erro ao criar sessao:', error);
            return res.status(500).json({
                message: 'Erro ao criar sessao',
            });
        }
    }

    // PUT /api/sessoes/:id - Atualizar sessao
    async update(req, res) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: 'ID invalido',
            });
        }

        // Validar dados de entrada
        const valido = validarSessao(req.body);
        if (!valido) {
            const erro = validarSessao.errors[0];
            return res.status(400).json({
                message: erro.message || 'Dados invalidos',
            });
        }

        try {
            // Verificar se sessao existe
            const sessaoExiste = await Sessao.findByPk(id, false);
            if (!sessaoExiste) {
                return res.status(404).json({
                    message: 'Sessao nao encontrada',
                });
            }

            // Verificar se a sala existe
            const salaExiste = await Sala.findByPk(req.body.sala_id);
            if (!salaExiste) {
                return res.status(400).json({
                    message: 'Sala nao encontrada',
                });
            }

            // Atualizar
            const atualizado = await Sessao.update(req.body, id);
            if (atualizado) {
                const sessaoAtualizada = await Sessao.findByPk(id, true);
                const precos = Sessao.calcularPrecos(sessaoAtualizada.valor_ingresso_base);
                return res.status(200).json({
                    ...sessaoAtualizada.toJSON(),
                    precos: precos,
                });
            } else {
                return res.status(500).json({
                    message: 'Erro ao atualizar sessao',
                });
            }
        } catch (error) {
            console.error('Erro ao atualizar sessao:', error);
            return res.status(500).json({
                message: 'Erro ao atualizar sessao',
            });
        }
    }

    // DELETE /api/sessoes/:id - Excluir sessao
    async delete(req, res) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: 'ID invalido',
            });
        }

        try {
            const removido = await Sessao.delete(id);

            if (removido) {
                return res.status(200).json({
                    message: 'Sessao excluida com sucesso',
                });
            } else {
                return res.status(404).json({
                    message: 'Sessao nao encontrada',
                });
            }
        } catch (error) {
            console.error('Erro ao excluir sessao:', error);
            return res.status(500).json({
                message: 'Erro ao excluir sessao',
            });
        }
    }
}

module.exports = new SessaoController();
