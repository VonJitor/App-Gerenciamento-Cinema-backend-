// Schema de validacao para Produto (Bomboniere)
// Usa AJV para validar dados de entrada

const produtoSchema = {
    type: 'object',
    properties: {
        nome: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            errorMessage: {
                type: 'Nome deve ser uma string',
                minLength: 'Nome do produto eh obrigatorio',
                maxLength: 'Nome deve ter no maximo 100 caracteres',
            },
        },
        categoria: {
            type: 'string',
            enum: ['Pipoca', 'Bebida', 'Doce', 'Combo', 'Outros'],
            errorMessage: {
                type: 'Categoria deve ser uma string',
                enum: 'Categoria deve ser: Pipoca, Bebida, Doce, Combo ou Outros',
            },
        },
        preco: {
            type: 'number',
            minimum: 0,
            maximum: 1000,
            errorMessage: {
                type: 'Preco deve ser um numero',
                minimum: 'Preco nao pode ser negativo',
                maximum: 'Preco deve ser no maximo R$ 1000',
            },
        },
        estoque: {
            type: 'integer',
            minimum: 0,
            errorMessage: {
                type: 'Estoque deve ser um numero inteiro',
                minimum: 'Estoque nao pode ser negativo',
            },
        },
    },
    required: ['nome', 'categoria', 'preco'],
    errorMessage: {
        required: {
            nome: 'Nome do produto eh obrigatorio',
            categoria: 'Categoria eh obrigatoria',
            preco: 'Preco eh obrigatorio',
        },
    },
    additionalProperties: false,
};

module.exports = produtoSchema;
