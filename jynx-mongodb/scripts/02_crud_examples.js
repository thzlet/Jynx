use('jynx');

// buscando por email
print('--- findOne: usuário por e-mail ---');
printjson(db.usuarios.findOne({ email: 'player@email.com' }));

// filtro composto
print('\n--- find: jogos Indie com preço < R$30 ---');
db.jogos.find(
  { generos: 'Indie', preco: { $lt: 30 } }
).forEach(printjson);

// com projeção 
print('\n--- find com projeção: título, nota e preço dos jogos RPG ---');
db.jogos.find(
  { generos: 'RPG' },
  { titulo: 1, nota_media: 1, preco: 1, _id: 0 }
).forEach(printjson);

// com ordenação 
print('\n--- find com sort: top 5 jogos mais bem avaliados ---');
db.jogos.find(
  {},
  { titulo: 1, nota_media: 1, _id: 0 }
).sort({ nota_media: -1 }).limit(5).forEach(printjson);

// com paginação 
print('\n--- find com paginação: página 2 (2 por página) ---');
db.jogos.find(
  {},
  { titulo: 1, _id: 0 }
).sort({ titulo: 1 }).skip(2).limit(2).forEach(printjson);


// updates 

const usuario = db.usuarios.findOne({ email: 'player@email.com' });
const hollowKnight = db.jogos.findOne({ titulo: 'Hollow Knight' });
const entrada = db.biblioteca.findOne({ usuario_id: usuario._id, jogo_id: hollowKnight._id });

// $set: atualizar status e nota
print('--- updateOne com $set: atualizar status e nota do Hollow Knight ---');
db.biblioteca.updateOne(
  { _id: entrada._id },
  { $set: { status: 'finalizado', nota_pessoal: 5 } }
);
printjson(db.biblioteca.findOne({ _id: entrada._id }, { titulo: 1, status: 1, nota_pessoal: 1 }));

// $inc: incrementar horas jogadas
print('\n--- updateOne com $inc: adicionar 2.5h ao Hollow Knight ---');
db.biblioteca.updateOne(
  { _id: entrada._id },
  { $inc: { horas_jogadas: 2.5 } }
);
printjson(db.biblioteca.findOne({ _id: entrada._id }, { titulo: 1, horas_jogadas: 1, _id: 0 }));

// $inc: adicionar XP ao usuário
print('\n--- updateOne com $inc: adicionar 200 XP ao usuário ---');
db.usuarios.updateOne(
  { _id: usuario._id },
  { $inc: { xp_total: 200 } }
);
printjson(db.usuarios.findOne({ _id: usuario._id }, { nome: 1, xp_total: 1, _id: 0 }));

// $push: adicionar conquista
print('\n--- updateOne com $push: adicionar conquista "Coração Puro" ---');
db.biblioteca.updateOne(
  { _id: entrada._id },
  {
    $push: {
      conquistas: {
        nome: 'Coração Puro',
        desbloqueada_em: new Date()
      }
    }
  }
);
printjson(db.biblioteca.findOne({ _id: entrada._id }, { titulo: 1, conquistas: 1, _id: 0 }));

// $push + $slice: manter apenas os 5 jogos recentes (subset pattern)
print('\n--- updateOne com $push + $slice: atualizar jogos recentes (Subset Pattern) ---');
db.usuarios.updateOne(
  { _id: usuario._id },
  {
    $push: {
      jogos_recentes: {
        $each: [{ jogo_id: hollowKnight._id, titulo: 'Hollow Knight', capa_url: 'https://cdn.jynx.com/capas/hollow-knight.jpg', horas: 45 }],
        $position: 0,
        $slice: 5
      }
    }
  }
);
printjson(db.usuarios.findOne({ _id: usuario._id }, { nome: 1, jogos_recentes: 1, _id: 0 }));


// deletes 

// jogo temporário !!!
const stardew = db.jogos.findOne({ titulo: 'Stardew Valley' });
db.biblioteca.insertOne({
  usuario_id: usuario._id,
  jogo_id: stardew._id,
  titulo: 'Stardew Valley',
  capa_url: 'https://cdn.jynx.com/capas/stardew.jpg',
  status: 'lista_de_desejos',
  horas_jogadas: 0,
  nota_pessoal: null,
  conquistas: [],
  adicionado_em: new Date()
});
print('(Jogo temporário inserido)');
print('Biblioteca antes do delete: ' + db.biblioteca.countDocuments() + ' documento(s)');

// deleteOne: remover da biblioteca
print('\n--- deleteOne: remover Stardew Valley da biblioteca ---');
db.biblioteca.deleteOne({
  usuario_id: usuario._id,
  jogo_id: stardew._id
});
print('Biblioteca depois delete: ' + db.biblioteca.countDocuments() + ' documento(s)');

// soft delete: desativar conta sem apagar
print('\n--- Soft Delete: desativar conta do usuário ---');
db.usuarios.updateOne(
  { _id: usuario._id },
  { $set: { ativo: false, desativado_em: new Date() } }
);
printjson(db.usuarios.findOne({ _id: usuario._id }, { nome: 1, ativo: 1, desativado_em: 1, _id: 0 }));

// reativar para não quebrar os próximos scripts
db.usuarios.updateOne(
  { _id: usuario._id },
  { $unset: { ativo: '', desativado_em: '' } }
);
print('(Conta reativada)\n');