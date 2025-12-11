// Schema de validacao para Sessao
// Usa AJV para validar dados de entrada

const sessaoSchema = {
    type: 'object',
    properties: {
        filme: {
            type: 'string',
            minLength: 1,
            maxLength: 200,
            errorMessage: {
                type: 'Filme deve ser uma string',
                minLength: 'Titulo do filme eh obrigatorio',
                maxLength: 'Titulo do filme deve ter no maximo 200 caracteres',
            },
        },
        horario_inicio: {
            type: 'string',
            format: 'date-time',
            errorMessage: {
                type: 'Horario de inicio deve ser uma string',
                format: 'Horario de inicio deve estar no formato ISO 8601 (ex: 2024-12-25T14:30:00)',
            },
        },
        valor_ingresso_base: {
            type: 'number',
            minimum: 0,
            maximum: 1000,
            errorMessage: {
                type: 'Valor do ingresso deve ser um numero',
                minimum: 'Valor do ingresso nao pode ser negativo',
                maximum: 'Valor do ingresso deve ser no maximo R$ 1000',
            },
        },
        sala_id: {
            type: 'integer',
            minimum: 1,
            errorMessage: {
                type: 'ID da sala deve ser um numero inteiro',
                minimum: 'ID da sala invalido',
            },
        },
    },
    required: ['filme', 'horario_inicio', 'valor_ingresso_base', 'sala_id'],
    errorMessage: {
        required: {
            filme: 'Titulo do filme eh obrigatorio',
            horario_inicio: 'Horario de inicio eh obrigatorio',
            valor_ingresso_base: 'Valor do ingresso eh obrigatorio',
            sala_id: 'Sala eh obrigatoria',
        },
    },
    additionalProperties: false,
};

module.exports = sessaoSchema;
