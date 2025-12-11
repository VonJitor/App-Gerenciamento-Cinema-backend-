// Definicao das relacoes entre modelos
// Sala <-> Sessao: Uma sala pode ter muitas sessoes

module.exports = function (models) {
  const { Sala, Sessao } = models;

  // Uma Sala tem muitas Sessoes
  if (Sala && Sessao) {
    Sala.hasMany(Sessao, {
      foreignKey: 'sala_id',
      as: 'sessoes',
    });

    // Uma Sessao pertence a uma Sala
    Sessao.belongsTo(Sala, {
      foreignKey: 'sala_id',
    });
  }
};
