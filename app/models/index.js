// Index de models - inicializa e exporta todos os modelos
const conexao = require('./conexao.js');

const db = {}; // armazenar os models

// Importar models do CineManager
db.usuario = require('./Usuario.js');
db.sala = require('./Sala.js');
db.sessao = require('./Sessao.js');
db.produto = require('./Produto.js');

// Lista de associacoes
require('./relations.js')(conexao.models);

// Conectando e sincronizando com BD
conexao
  .sync({}) // { force: true } --> para forcar a recriacao do banco
  .then(() => {
    console.log('Banco de dados sincronizado!');
  })
  .catch((err) => {
    console.log('Falha ao sincronizar: ' + err.message);
  });

module.exports = db;
