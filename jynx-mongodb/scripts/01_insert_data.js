use('jynx');

db.usuarios.drop();
db.jogos.drop();
db.biblioteca.drop();
db.logs.drop();
print('Coleções limpas.');

// inserindo usuario  
db.usuarios.insertOne({
  nome: 'PlayerOne',
  email: 'player@email.com',
  senha_hash: '$2b$10$hashdasenha',
  avatar_url: 'https://cdn.jynx.com/avatars/default.png',
  nivel: 1,
  xp_total: 0,
  jogos_recentes: [],
  criado_em: new Date(),
  schema_version: 1
});

// insserindo jogos
db.jogos.insertMany([
  {
    titulo: 'Hollow Knight',
    generos: ['Metroidvania', 'Indie', 'Plataforma'],
    desenvolvedor: 'Team Cherry',
    data_lancamento: new Date('2017-02-24'),
    plataformas: ['PC', 'PS4', 'Xbox One', 'Switch'],
    preco: 19.99,
    nota_media: 4.8,
    total_avaliacoes: 3240,
    tags: ['difícil', 'atmosférico', 'exploração'],
    capa_url: 'https://cdn.jynx.com/capas/hollow-knight.jpg'
  },
  {
    titulo: 'Celeste',
    generos: ['Plataforma', 'Indie'],
    desenvolvedor: 'Maddy Makes Games',
    data_lancamento: new Date('2018-01-25'),
    plataformas: ['PC', 'PS4', 'Switch'],
    preco: 24.99,
    nota_media: 4.9,
    total_avaliacoes: 1800,
    tags: ['difícil', 'narrativa', 'pixel art'],
    capa_url: 'https://cdn.jynx.com/capas/celeste.jpg'
  },
  {
    titulo: 'Hades',
    generos: ['RPG', 'Roguelike', 'Ação'],
    desenvolvedor: 'Supergiant Games',
    data_lancamento: new Date('2020-09-17'),
    plataformas: ['PC', 'PS4', 'PS5', 'Switch'],
    preco: 39.99,
    nota_media: 4.9,
    total_avaliacoes: 5100,
    tags: ['roguelike', 'narrativa', 'combate'],
    capa_url: 'https://cdn.jynx.com/capas/hades.jpg'
  },
  {
    titulo: 'Stardew Valley',
    generos: ['RPG', 'Simulação', 'Indie'],
    desenvolvedor: 'ConcernedApe',
    data_lancamento: new Date('2016-02-26'),
    plataformas: ['PC', 'PS4', 'Switch', 'Mobile'],
    preco: 14.99,
    nota_media: 4.7,
    total_avaliacoes: 8900,
    tags: ['relaxante', 'farm', 'pixel art'],
    capa_url: 'https://cdn.jynx.com/capas/stardew.jpg'
  }
]);

// entradas na biblioteca 
const usuario = db.usuarios.findOne({ email: 'player@email.com' });
const hollowKnight = db.jogos.findOne({ titulo: 'Hollow Knight' });
const celeste = db.jogos.findOne({ titulo: 'Celeste' });
const hades = db.jogos.findOne({ titulo: 'Hades' });

db.biblioteca.insertMany([
  {
    usuario_id: usuario._id,
    jogo_id: hollowKnight._id,
    titulo: 'Hollow Knight',
    capa_url: 'https://cdn.jynx.com/capas/hollow-knight.jpg',
    status: 'finalizado',
    horas_jogadas: 42.5,
    nota_pessoal: 5,
    conquistas: [
      { nome: 'Primeiro Chefe', desbloqueada_em: new Date('2024-02-01T20:00:00Z') },
      { nome: 'Explorador',     desbloqueada_em: new Date('2024-02-15T18:30:00Z') }
    ],
    adicionado_em: new Date('2024-01-20T14:00:00Z')
  },
  {
    usuario_id: usuario._id,
    jogo_id: celeste._id,
    titulo: 'Celeste',
    capa_url: 'https://cdn.jynx.com/capas/celeste.jpg',
    status: 'jogando',
    horas_jogadas: 18.0,
    nota_pessoal: 5,
    conquistas: [
      { nome: 'Capítulo 1 completo', desbloqueada_em: new Date('2024-03-05T21:00:00Z') }
    ],
    adicionado_em: new Date('2024-03-01T10:00:00Z')
  },
  {
    usuario_id: usuario._id,
    jogo_id: hades._id,
    titulo: 'Hades',
    capa_url: 'https://cdn.jynx.com/capas/hades.jpg',
    status: 'jogando',
    horas_jogadas: 61.0,
    nota_pessoal: 5,
    conquistas: [
      { nome: 'Primeira fuga', desbloqueada_em: new Date('2024-03-10T22:00:00Z') }
    ],
    adicionado_em: new Date('2024-03-08T15:00:00Z')
  }
]);

// logs iniciais 
db.logs.insertMany([
  {
    usuario_id: usuario._id,
    acao: 'login',
    detalhes: { dispositivo: 'PC', sistema: 'Windows 11' },
    ip: '177.92.10.55',
    criado_em: new Date()
  },
  {
    usuario_id: usuario._id,
    acao: 'add_jogo',
    detalhes: { jogo_id: hollowKnight._id, titulo: 'Hollow Knight' },
    ip: '177.92.10.55',
    criado_em: new Date()
  }
]);