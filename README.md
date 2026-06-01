# Jynx MongoDB 🎮 

---

## Sobre o projeto

O **Jynx** é uma plataforma digital de gerenciamento e descoberta de jogos. Este repositório contém a modelagem do banco de dados NoSQL em MongoDB, com implementação de:

- Modelagem de documentos com Design Patterns (Extended Reference, Subset Pattern)
- Operações CRUD completas
- Consultas com agregações (`$lookup`, `$group`, `$unwind`, `$project`, etc.)
- Registro e análise de logs de atividade

---

## Coleções

| Coleção | Descrição |
|---|---|
| `usuarios` | Jogadores cadastrados na plataforma |
| `jogos` | Catálogo global com metadados de cada título |
| `biblioteca` | Relação entre usuário e seus jogos |
| `logs` | Registro automático das ações dos usuários |

---

## Pré-requisitos

- [MongoDB Community Edition](https://www.mongodb.com/try/download/community) instalado e rodando
- `mongosh` disponível no terminal

Para verificar:
```bash
mongosh --version
```

---

## Como executar

```bash
# 1. Cria o banco e insere todos os dados iniciais
mongosh scripts/01_inserir_dados.js

# 2. Demonstra todas as operações CRUD (READ, UPDATE, DELETE)
mongosh scripts/02_crud.js

# 3. Executa as consultas com agregações
mongosh scripts/03_agregacoes.js

# 4. Insere e consulta logs de atividade
mongosh scripts/04_logs.js
```

> O script `01_inserir_dados.js` apaga e recria as coleções.

---

## Estrutura do projeto

```
jynx-mongodb/
├── README.md
└── scripts/
    ├── 01_inserir_dados.js   # CREATE: insere usuários, jogos, biblioteca e logs
    ├── 02_crud.js            # READ, UPDATE e DELETE com diversos operadores
    ├── 03_agregacoes.js      # Pipelines de agregação ($lookup, $group, etc.)
    └── 04_logs.js            # Registro e análise de logs de atividade
```

---

## Design Patterns aplicados

**Extended Reference Pattern** — na coleção `biblioteca`, os campos `titulo` e `capa_url` são copiados do jogo para evitar lookups na listagem principal.

**Subset Pattern** — no documento de usuário, o campo `jogos_recentes` armazena apenas os 5 jogos mais recentes, usando `$push` + `$slice`.

---

## Exemplo de resultado — Agregação de gêneros

```
Gênero: RPG        | Horas: 61.0  | Jogadores: 1
Gênero: Metroidvania | Horas: 42.5 | Jogadores: 1
Gênero: Plataforma | Horas: 60.5  | Jogadores: 2
Gênero: Indie      | Horas: 60.5  | Jogadores: 2
```
