// Schema de validacao para Usuario (registro e login)
// Usa AJV para validar dados de entrada

const registroSchema = {
    type: 'object',
    properties: {
        nome: {
            type: 'string',
            minLength: 2,
            maxLength: 100,
            errorMessage: {
                type: 'Nome deve ser uma string',
                minLength: 'Nome deve ter no minimo 2 caracteres',
                maxLength: 'Nome deve ter no maximo 100 caracteres',
            },
        },
        email: {
            type: 'string',
            format: 'email',
            maxLength: 150,
            errorMessage: {
                type: 'Email deve ser uma string',
                format: 'Email invalido',
                maxLength: 'Email deve ter no maximo 150 caracteres',
            },
        },
        senha: {
            type: 'string',
            minLength: 6,
            maxLength: 50,
            errorMessage: {
                type: 'Senha deve ser uma string',
                minLength: 'Senha deve ter no minimo 6 caracteres',
                maxLength: 'Senha deve ter no maximo 50 caracteres',
            },
        },
    },
    required: ['nome', 'email', 'senha'],
    errorMessage: {
        required: {
            nome: 'Nome eh obrigatorio',
            email: 'Email eh obrigatorio',
            senha: 'Senha eh obrigatoria',
        },
    },
    additionalProperties: false,
};

const loginSchema = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            format: 'email',
            errorMessage: {
                type: 'Email deve ser uma string',
                format: 'Email invalido',
            },
        },
        senha: {
            type: 'string',
            minLength: 1,
            errorMessage: {
                type: 'Senha deve ser uma string',
                minLength: 'Senha eh obrigatoria',
            },
        },
    },
    required: ['email', 'senha'],
    errorMessage: {
        required: {
            email: 'Email eh obrigatorio',
            senha: 'Senha eh obrigatoria',
        },
    },
    additionalProperties: false,
};

module.exports = { registroSchema, loginSchema };
