use('jynx');

print('Operadores: $lookup, $unwind, $group, $sort, $limit, $project\n');

const rankingGeneros = db.biblioteca.aggregate([
  // etapa 1: $lookup unir biblioteca com dados do jogo
  {
    $lookup: {
      from: 'jogos',
      localField: 'jogo_id',
      foreignField: '_id',
      as: 'jogo_info'
    }
  },
  // etapa 2: $unwind desempacotar o array jogo_info (1 doc por item)
  { $unwind: '$jogo_info' },
  // etapa 3: $unwind expandir cada gênero do array generos
  { $unwind: '$jogo_info.generos' },
  // etapa 4: $group somar horas por gênero
  {
    $group: {
      _id: '$jogo_info.generos',
      total_horas: { $sum: '$horas_jogadas' },
      total_jogadores: { $sum: 1 }
    }
  },
  // etapa 5: $sort gênero com mais horas primeiro
  { $sort: { total_horas: -1 } },
  // etapa 6: $limit top 5 gêneros
  { $limit: 5 },
  // etapa 7: $project formatar saída final
  {
    $project: {
      _id: 0,
      genero: '$_id',
      total_horas: { $round: ['$total_horas', 1] },
      total_jogadores: 1
    }
  }
]).toArray();

print('Resultado:');
rankingGeneros.forEach(r => {
  print(`  Gênero: ${r.genero} | Horas: ${r.total_horas} | Jogadores: ${r.total_jogadores}`);
});


print('Operadores: $match, $addFields, $dateToString, $group, $sort, $project\n');

// inserir logs com datas variadas
const usuario = db.usuarios.findOne({ email: 'player@email.com' });
const datas = [
  new Date(Date.now() - 5  * 24 * 60 * 60 * 1000),  
  new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),  
  new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), 
  new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),  
  new Date(Date.now() - 80 * 24 * 60 * 60 * 1000),
];

const logsExtras = datas.map(data => ({
  usuario_id: usuario._id,
  acao: 'login',
  detalhes: { dispositivo: 'PC' },
  ip: '177.92.10.55',
  criado_em: data
}));

db.logs.insertMany(logsExtras);
print('(Logs extras inseridos para enriquecer o relatório)');

const relatorioMensal = db.logs.aggregate([
  // etapa 1: $match filtrar apenas os logs dos últimos 90 dias
  {
    $match: {
      criado_em: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
    }
  },
  // etapa 2: $addFields extrair o mês/ano do timestamp
  {
    $addFields: {
      mes: { $dateToString: { format: '%Y-%m', date: '$criado_em' } }
    }
  },
  // etapa 3: $group contar ações por usuário por mês
  {
    $group: {
      _id: { usuario_id: '$usuario_id', mes: '$mes' },
      total_acoes: { $sum: 1 },
      acoes_por_tipo: { $push: '$acao' }
    }
  },
  // etapa 4: $sort mais recentes e mais ativos primeiro
  { $sort: { '_id.mes': -1, total_acoes: -1 } },
  // etapa 5: $project formatar saída
  {
    $project: {
      _id: 0,
      usuario_id: '$_id.usuario_id',
      mes: '$_id.mes',
      total_acoes: 1
    }
  }
]).toArray();

print('\nResultado:');
relatorioMensal.forEach(r => {
  print(`  Mês: ${r.mes} | Ações: ${r.total_acoes} | Usuário: ${r.usuario_id}`);
});

print('Operadores: $match, $lookup, $unwind, $project\n');

const bibliotecaCompleta = db.biblioteca.aggregate([
  // filtra apenas os jogos do nosso usuário
  { $match: { usuario_id: usuario._id } },
  // traz os dados completos do jogo
  {
    $lookup: {
      from: 'jogos',
      localField: 'jogo_id',
      foreignField: '_id',
      as: 'detalhes_jogo'
    }
  },
  { $unwind: '$detalhes_jogo' },
  // formata a saída
  {
    $project: {
      _id: 0,
      titulo: 1,
      status: 1,
      horas_jogadas: 1,
      nota_pessoal: 1,
      desenvolvedor: '$detalhes_jogo.desenvolvedor',
      generos: '$detalhes_jogo.generos',
      total_conquistas: { $size: '$conquistas' }
    }
  },
  { $sort: { horas_jogadas: -1 } }
]).toArray();

print('Resultado:');
bibliotecaCompleta.forEach(j => {
  print(`  [${j.status.toUpperCase()}] ${j.titulo} — ${j.horas_jogadas}h | Nota: ${j.nota_pessoal}/5 | Conquistas: ${j.total_conquistas}`);
});