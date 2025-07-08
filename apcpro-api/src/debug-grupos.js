/**
 * Script de debug para consultar grupos e relacionamentos
 * Execute com: node src/debug-grupos.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

async function debugGrupos() {
  console.log('🔍 Debug - Consultando grupos e relacionamentos...\n');

  try {
    // 1. Verificar se existem grupos
    const totalGrupos = await prisma.grupo.count();
    console.log(`📊 Total de grupos: ${totalGrupos}`);

    // 2. Verificar se existem UserPerfis
    const totalUserPerfis = await prisma.userPerfil.count();
    console.log(`👥 Total de UserPerfis: ${totalUserPerfis}`);

    // 3. Verificar relacionamentos na tabela _MembroGrupo
    const relacionamentos = await prisma.$queryRaw`
      SELECT COUNT(*) as total FROM "_MembroGrupo"
    `;
    console.log(`🔗 Total de relacionamentos: ${relacionamentos[0].total}\n`);

    // 4. Listar todos os grupos com detalhes
    const grupos = await prisma.grupo.findMany({
      include: {
        criadoPor: {
          include: {
            user: true
          }
        },
        membros: {
          include: {
            user: true
          }
        }
      }
    });

    console.log('📝 Grupos encontrados:');
    grupos.forEach((grupo, index) => {
      console.log(`\n${index + 1}. Grupo: ${grupo.nome}`);
      console.log(`   ID: ${grupo.id}`);
      console.log(`   Criado por: ${grupo.criadoPor?.user?.name || 'N/A'}`);
      console.log(`   Criado por ID: ${grupo.criadoPorId}`);
      console.log(`   Total de membros: ${grupo.membros.length}`);
      
      if (grupo.membros.length > 0) {
        console.log('   Membros:');
        grupo.membros.forEach((membro, i) => {
          console.log(`     ${i + 1}. ${membro.user?.name || 'N/A'} (${membro.user?.email || 'N/A'})`);
          console.log(`        UserPerfil ID: ${membro.id}`);
          console.log(`        Role: ${membro.role}`);
        });
      }
    });

    // 5. Listar todos os UserPerfis que são professores
    const professores = await prisma.userPerfil.findMany({
      where: {
        role: 'professor'
      },
      include: {
        user: true,
        gruposCriados: true
      }
    });

    console.log('\n👨‍🏫 Professores encontrados:');
    professores.forEach((prof, index) => {
      console.log(`\n${index + 1}. Professor: ${prof.user?.name || 'N/A'}`);
      console.log(`   UserPerfil ID: ${prof.id}`);
      console.log(`   User ID: ${prof.userId}`);
      console.log(`   Grupos criados: ${prof.gruposCriados.length}`);
    });

    // 6. Verificar a tabela de relacionamento diretamente
    const relacionamentosDiretos = await prisma.$queryRaw`
      SELECT 
        mg."A" as grupo_id,
        mg."B" as user_perfil_id,
        g.nome as grupo_nome,
        u.name as user_name
      FROM "_MembroGrupo" mg
      LEFT JOIN "Grupo" g ON mg."A" = g.id
      LEFT JOIN "UserPerfil" up ON mg."B" = up.id
      LEFT JOIN "User" u ON up."userId" = u.id
    `;

    console.log('\n🔗 Relacionamentos diretos na tabela _MembroGrupo:');
    relacionamentosDiretos.forEach((rel, index) => {
      console.log(`${index + 1}. Grupo: ${rel.grupo_nome} → Membro: ${rel.user_name}`);
      console.log(`   Grupo ID: ${rel.grupo_id} → UserPerfil ID: ${rel.user_perfil_id}`);
    });

  } catch (error) {
    console.error('❌ Erro ao consultar grupos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugGrupos();
