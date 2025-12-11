// Controller de Usuarios
// CRUD completo para gerenciamento de usuarios

const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const ajvErrors = require('ajv-errors');
const bcrypt = require('bcrypt');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
ajvErrors(ajv);

const models = require('../models/index.js');
const Usuario = models.usuario.Usuario;

// Schema para atualizar usuario
const atualizarUsuarioSchema = {
    type: 'object',
    properties: {
        nome: { type: 'string', minLength: 2, maxLength: 100 },
        email: { type: 'string', format: 'email' },
        senha: { type: 'string', minLength: 6 },
    },
    required: ['nome', 'email'],
    additionalProperties: false,
    errorMessage: {
        properties: {
            nome: 'Nome deve ter entre 2 e 100 caracteres',
            email: 'Email invalido',
            senha: 'Senha deve ter no minimo 6 caracteres',
        },
    },
};

const validarAtualizacao = ajv.compile(atualizarUsuarioSchema);

class UsuarioController {
    // GET /api/usuarios - Listar todos os usuarios
    async findAll(req, res) {
        try {
            const usuarios = await Usuario.findAll();

            // Remove senha dos resultados
            const usuariosSemSenha = usuarios.map(u => ({
                id: u.id,
                nome: u.nome,
                email: u.email,
                createdAt: u.createdAt,
                updatedAt: u.updatedAt,
            }));

            return res.status(200).json(usuariosSemSenha);
        } catch (error) {
            console.error('Erro ao listar usuarios:', error);
            return res.status(500).json({
                message: 'Erro ao listar usuarios',
            });
        }
    }

    // GET /api/usuarios/:id - Buscar usuario por ID
    async find(req, res) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: 'ID invalido',
            });
        }

        try {
            const usuario = await Usuario.findByPk(id);

            if (!usuario) {
                return res.status(404).json({
                    message: 'Usuario nao encontrado',
                });
            }

            // Remove senha do resultado
            return res.status(200).json({
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                createdAt: usuario.createdAt,
                updatedAt: usuario.updatedAt,
            });
        } catch (error) {
            console.error('Erro ao buscar usuario:', error);
            return res.status(500).json({
                message: 'Erro ao buscar usuario',
            });
        }
    }

    // PUT /api/usuarios/:id - Atualizar usuario
    async update(req, res) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: 'ID invalido',
            });
        }

        // Validar dados de entrada
        const valido = validarAtualizacao(req.body);
        if (!valido) {
            const erro = validarAtualizacao.errors[0];
            return res.status(400).json({
                message: erro.message || 'Dados invalidos',
            });
        }

        try {
            // Verificar se usuario existe
            const usuarioExiste = await Usuario.findByPk(id);
            if (!usuarioExiste) {
                return res.status(404).json({
                    message: 'Usuario nao encontrado',
                });
            }

            // Verificar se email ja existe (em outro usuario)
            const emailExiste = await Usuario.findByEmail(req.body.email);
            if (emailExiste && emailExiste.id !== id) {
                return res.status(400).json({
                    message: 'Email ja esta em uso',
                });
            }

            // Preparar dados para atualizar
            const dadosAtualizar = {
                nome: req.body.nome,
                email: req.body.email,
            };

            // Se senha foi fornecida, fazer hash
            if (req.body.senha) {
                dadosAtualizar.senha = await bcrypt.hash(req.body.senha, 10);
            }

            // Atualizar
            const atualizado = await Usuario.update(dadosAtualizar, id);
            if (atualizado) {
                const usuarioAtualizado = await Usuario.findByPk(id);
                return res.status(200).json({
                    id: usuarioAtualizado.id,
                    nome: usuarioAtualizado.nome,
                    email: usuarioAtualizado.email,
                    message: 'Usuario atualizado com sucesso',
                });
            } else {
                return res.status(500).json({
                    message: 'Erro ao atualizar usuario',
                });
            }
        } catch (error) {
            console.error('Erro ao atualizar usuario:', error);
            return res.status(500).json({
                message: 'Erro ao atualizar usuario',
            });
        }
    }

    // DELETE /api/usuarios/:id - Excluir usuario
    async delete(req, res) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: 'ID invalido',
            });
        }

        // Impedir que usuario exclua a si mesmo
        if (req.usuario && req.usuario.id === id) {
            return res.status(400).json({
                message: 'Voce nao pode excluir sua propria conta',
            });
        }

        try {
            const removido = await Usuario.delete(id);

            if (removido) {
                return res.status(200).json({
                    message: 'Usuario excluido com sucesso',
                });
            } else {
                return res.status(404).json({
                    message: 'Usuario nao encontrado',
                });
            }
        } catch (error) {
            console.error('Erro ao excluir usuario:', error);
            return res.status(500).json({
                message: 'Erro ao excluir usuario',
            });
        }
    }
}

module.exports = new UsuarioController();
