// Model de Usuario para autenticacao
// Campos: id, nome, email (unico), senha (hash bcrypt)

const Sequelize = require('sequelize');
const db = require('./conexao.js');
const bcrypt = require('bcrypt');

class Usuario {
    // Busca usuario por ID
    static async findByPk(id) {
        try {
            const resultado = await UsuarioModel.findByPk(id, {
                attributes: { exclude: ['senha'] }, // nao retorna senha
            });
            return resultado || null;
        } catch (error) {
            throw error;
        }
    }

    // Busca usuario por email (usado no login)
    static async findByEmail(email) {
        try {
            const resultado = await UsuarioModel.findOne({
                where: { email: email },
            });
            return resultado || null;
        } catch (error) {
            throw error;
        }
    }

    // Lista todos usuarios
    static async findAll() {
        try {
            const resultados = await UsuarioModel.findAll({
                attributes: { exclude: ['senha'] }, // nao retorna senha
            });
            return resultados || [];
        } catch (error) {
            throw error;
        }
    }

    // Cria novo usuario com senha hasheada
    static async create(novoUsuario) {
        try {
            // Hash da senha antes de salvar (10 rounds de salt)
            const senhaHash = await bcrypt.hash(novoUsuario.senha, 10);

            const usuario = await UsuarioModel.create({
                nome: novoUsuario.nome,
                email: novoUsuario.email,
                senha: senhaHash,
            });

            // Retorna sem a senha
            return {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
            };
        } catch (error) {
            throw error;
        }
    }

    // Atualiza usuario
    static async update(dados, idUsuario) {
        try {
            // Se estiver atualizando senha, faz hash
            if (dados.senha) {
                dados.senha = await bcrypt.hash(dados.senha, 10);
            }

            const resultado = await UsuarioModel.update(dados, {
                where: { id: idUsuario },
            });
            return resultado[0] > 0; // retorna true se atualizou
        } catch (error) {
            throw error;
        }
    }

    // Deleta usuario
    static async delete(id) {
        try {
            const data = await UsuarioModel.findByPk(id);
            if (data) {
                await data.destroy();
                return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    }

    // Valida senha (compara com hash)
    static async validarSenha(senhaPlana, senhaHash) {
        return await bcrypt.compare(senhaPlana, senhaHash);
    }
}

// Definicao do modelo Sequelize
const UsuarioModel = db.define('Usuario', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    nome: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true, // email deve ser unico
        validate: {
            isEmail: true,
        },
    },
    senha: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
});

module.exports = { Usuario, UsuarioModel };
