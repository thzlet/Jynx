use('jynx');

const usuario = db.usuarios.findOne({ email: 'player@email.com' });
const hollowKnight = db.jogos.findOne({ titulo: 'Hollow Knight' });
const celeste = db.jogos.findOne({ titulo: 'Celeste' });

// log de login
db.logs.insertOne({
  usuario_id: usuario._id,
  acao: 'login',
  detalhes: { dispositivo: 'PC', sistema: 'Windows 11' },
  ip: '177.92.10.55',
  criado_em: new Date()
});

// log de adição de jogo
db.logs.insertOne({
  usuario_id: usuario._id,
  acao: 'add_jogo',
  detalhes: { jogo_id: hollowKnight._id, titulo: 'Hollow Knight' },
  ip: '177.92.10.55',
  criado_em: new Date()
});

// log de atualização de status
db.logs.insertOne({
  usuario_id: usuario._id,
  acao: 'update_status',
  detalhes: {
    jogo_id: hollowKnight._id,
    titulo: 'Hollow Knight',
    status_anterior: 'jogando',
    status_novo: 'finalizado'
  },
  ip: '177.92.10.55',
  criado_em: new Date()
});

// log de conquista desbloqueada
db.logs.insertOne({
  usuario_id: usuario._id,
  acao: 'conquista_desbloqueada',
  detalhes: {
    jogo_id: hollowKnight._id,
    titulo: 'Hollow Knight',
    conquista: 'Coração Puro'
  },
  ip: '177.92.10.55',
  criado_em: new Date()
});

// log de avaliação
db.logs.insertOne({
  usuario_id: usuario._id,
  acao: 'avaliar_jogo',
  detalhes: {
    jogo_id: celeste._id,
    titulo: 'Celeste',
    nota: 5,
    comentario: 'Jogo incrível!'
  },
  ip: '177.92.10.55',
  criado_em: new Date()
});

// CONSULTANDO OS LOGS

// ultimas 20 ações do usuário
print('--- Últimas 20 ações do usuário ---');
db.logs
  .find({ usuario_id: usuario._id })
  .sort({ criado_em: -1 })
  .limit(20)
  .forEach(log => {
    print(`  [${log.acao}] ${log.criado_em.toISOString()} — IP: ${log.ip}`);
  });

// contar logins nas últimas 24 horas
print('\n--- Logins nas últimas 24 horas ---');
const loginsHoje = db.logs.countDocuments({
  acao: 'login',
  criado_em: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
});
print(`  Total: ${loginsHoje} login(s)`);

// contagem de ações por tipo
print('\n--- Contagem de ações por tipo (agregação) ---');
db.logs.aggregate([
  { $match: { usuario_id: usuario._id } },
  { $group: { _id: '$acao', total: { $sum: 1 } } },
  { $sort: { total: -1 } }
]).forEach(r => {
  print(`  ${r._id}: ${r.total} ocorrência(s)`);
});

// buscar logs de um tipo específico
print('\n--- Todos os logs de "update_status" ---');
db.logs
  .find({ usuario_id: usuario._id, acao: 'update_status' })
  .forEach(log => {
    printjson(log.detalhes);
  });

print('\nTOTAIS FINAIS DO BANCO\n');
print(`  usuarios:   ${db.usuarios.countDocuments()} documento(s)`);
print(`  jogos:      ${db.jogos.countDocuments()} documento(s)`);
print(`  biblioteca: ${db.biblioteca.countDocuments()} documento(s)`);
print(`  logs:       ${db.logs.countDocuments()} documento(s)`);