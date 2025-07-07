-- Script SQL para verificar o estado atual dos relacionamentos de grupos
-- Execute este script no PostgreSQL (pgAdmin ou psql)

-- 1. Verificar usuários
SELECT 
  u.id as user_id,
  u.name as user_name,
  u.email
FROM "User" u
ORDER BY u.name;

-- 2. Verificar perfis de usuários com informações do usuário
SELECT 
  up.id as perfil_id,
  up."userId" as user_id,
  u.name as user_name,
  up.role,
  up."professorId",
  up."grupoId"
FROM "UserPerfil" up
JOIN "User" u ON up."userId" = u.id
ORDER BY up.role, u.name;

-- 3. Verificar grupos
SELECT 
  g.id as grupo_id,
  g.nome as grupo_nome,
  g."criadoPorId",
  creator_u.name as criador_nome,
  g."criadoEm"
FROM "Grupo" g
JOIN "UserPerfil" creator_up ON g."criadoPorId" = creator_up.id
JOIN "User" creator_u ON creator_up."userId" = creator_u.id
ORDER BY g."criadoEm";

-- 4. Verificar tabela de relacionamento (a mais importante!)
SELECT 
  mg."A" as grupo_id,
  mg."B" as membro_perfil_id,
  g.nome as grupo_nome,
  u.name as membro_nome
FROM "_MembroGrupo" mg
JOIN "Grupo" g ON mg."A" = g.id
JOIN "UserPerfil" up ON mg."B" = up.id
JOIN "User" u ON up."userId" = u.id
ORDER BY g.nome, u.name;

-- 5. Contagem geral
SELECT 
  'Users' as tabela, COUNT(*) as total FROM "User"
UNION ALL
SELECT 
  'UserPerfil' as tabela, COUNT(*) as total FROM "UserPerfil"
UNION ALL
SELECT 
  'Grupo' as tabela, COUNT(*) as total FROM "Grupo"
UNION ALL
SELECT 
  '_MembroGrupo' as tabela, COUNT(*) as total FROM "_MembroGrupo";

-- 6. Verificar relacionamentos indiretos (se algum UserPerfil tem grupoId preenchido)
SELECT 
  up.id as perfil_id,
  u.name as user_name,
  up."grupoId",
  g.nome as grupo_nome
FROM "UserPerfil" up
JOIN "User" u ON up."userId" = u.id
LEFT JOIN "Grupo" g ON up."grupoId" = g.id
WHERE up."grupoId" IS NOT NULL
ORDER BY u.name;
