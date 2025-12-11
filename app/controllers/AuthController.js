// Controller de autenticacao
// Gerencia registro, login, logout e perfil

const jwt = require('jsonwebtoken');
const config = require('../../config.js');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const ajvErrors = require('ajv-errors');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
ajvErrors(ajv);

const { registroSchema, loginSchema } = require('../schemas/usuario.schema.js');
const validarRegistro = ajv.compile(registroSchema);
const validarLogin = ajv.compile(loginSchema);

const models = require('../models/index.js');
const Usuario = models.usuario.Usuario;

class AuthController {
    // POST /api/auth/register - Registrar novo usuario
    async register(req, res) {
        // Validar dados de entrada
        const valido = validarRegistro(req.body);
        if (!valido) {
            const erro = validarRegistro.errors[0];
            return res.status(400).json({
                message: erro.message || 'Dados invalidos',
            });
        }

        try {
            // Verificar se email ja existe
            const emailExiste = await Usuario.findByEmail(req.body.email);
            if (emailExiste) {
                return res.status(400).json({
                    message: 'Este email ja esta cadastrado',
                });
            }

            // Criar usuario (senha sera hasheada no model)
            const usuario = await Usuario.create(req.body);

            return res.status(201).json({
                message: 'Usuario registrado com sucesso',
                usuario: usuario,
            });
        } catch (error) {
            console.error('Erro ao registrar:', error);
            return res.status(500).json({
                message: 'Erro ao registrar usuario',
            });
        }
    }

    // POST /api/auth/login - Autenticar usuario
    async login(req, res) {
        // Validar dados de entrada
        const valido = validarLogin(req.body);
        if (!valido) {
            const erro = validarLogin.errors[0];
            return res.status(400).json({
                message: erro.message || 'Dados invalidos',
            });
        }

        try {
            // Buscar usuario pelo email
            const usuario = await Usuario.findByEmail(req.body.email);
            if (!usuario) {
                return res.status(401).json({
                    message: 'Email ou senha incorretos',
                });
            }

            // Validar senha
            const senhaValida = await Usuario.validarSenha(req.body.senha, usuario.senha);
            if (!senhaValida) {
                return res.status(401).json({
                    message: 'Email ou senha incorretos',
                });
            }

            // Gerar JWT
            const token = jwt.sign(
                {
                    id: usuario.id,
                    email: usuario.email,
                    nome: usuario.nome,
                },
                config.jwt.secret,
                { expiresIn: config.jwt.expiration }
            );

            // Enviar JWT via Cookie HttpOnly (SEGURO!)
            res.cookie('token', token, {
                httpOnly: true, // Nao acessivel via JavaScript
                secure: process.env.NODE_ENV === 'production', // HTTPS em producao
                sameSite: 'lax', // Protecao CSRF
                maxAge: config.jwt.expiration * 1000, // Tempo em ms
            });

            // Retornar sucesso (SEM o token no body!)
            return res.status(200).json({
                message: 'Login realizado com sucesso',
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                },
            });
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            return res.status(500).json({
                message: 'Erro ao fazer login',
            });
        }
    }

    // POST /api/auth/logout - Sair do sistema
    logout(req, res) {
        // Limpar o cookie de autenticacao
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        return res.status(200).json({
            message: 'Logout realizado com sucesso',
        });
    }

    // GET /api/auth/me - Obter dados do usuario logado
    async me(req, res) {
        try {
            // req.usuario eh setado pelo authMiddleware
            const usuario = await Usuario.findByPk(req.usuario.id);

            if (!usuario) {
                return res.status(404).json({
                    message: 'Usuario nao encontrado',
                });
            }

            return res.status(200).json(usuario);
        } catch (error) {
            console.error('Erro ao buscar usuario:', error);
            return res.status(500).json({
                message: 'Erro ao buscar dados do usuario',
            });
        }
    }
}

module.exports = new AuthController();
