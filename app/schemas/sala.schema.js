// Schema de validacao para Sala
// Usa AJV para validar dados de entrada

const salaSchema = {
    type: 'object',
    properties: {
        nome: {
            type: 'string',
            minLength: 1,
            maxLength: 80,
            errorMessage: {
                type: 'Nome deve ser uma string',
                minLength: 'Nome eh obrigatorio',
                maxLength: 'Nome deve ter no maximo 80 caracteres',
            },
        },
        capacidade: {
            type: 'integer',
            minimum: 1,
            maximum: 1000,
            errorMessage: {
                type: 'Capacidade deve ser um numero inteiro',
                minimum: 'Capacidade deve ser no minimo 1',
                maximum: 'Capacidade deve ser no maximo 1000',
            },
        },
    },
    required: ['nome', 'capacidade'],
    errorMessage: {
        required: {
            nome: 'Nome da sala eh obrigatorio',
            capacidade: 'Capacidade eh obrigatoria',
        },
    },
    additionalProperties: false,
};

module.exports = salaSchema;
