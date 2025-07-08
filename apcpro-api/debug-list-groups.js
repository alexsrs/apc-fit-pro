const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugListGroups() {
  try {
    console.log('📋 === LISTANDO TODOS OS GRUPOS ===');
    
    const userId = 'cmbpudp780000v07cqw1p7esm';
    
    // 1. Buscar perfil do usuário
    const userPerfil = await prisma.userPerfil.findFirst({
      where: { userId: userId }
    });
    
    console.log(`👤 Usuário: ${userId}`);
    console.log(`📋 Perfil: ${userPerfil ? userPerfil.id : 'NÃO ENCONTRADO'}`);
    
    // 2. Listar TODOS os grupos
    console.log('\n🗂️ === TODOS OS GRUPOS NO SISTEMA ===');
    const todosGrupos = await prisma.grupo.findMany({
      include: {
        membros: true,
        criadoPor: {
          include: {
            user: true
          }
        }
      }
    });
    
    console.log(`📊 Total de grupos: ${todosGrupos.length}`);
    
    if (todosGrupos.length > 0) {
      todosGrupos.forEach((grupo, index) => {
        console.log(`\n${index + 1}. 📁 ${grupo.nome}`);
        console.log(`   🆔 ID: ${grupo.id}`);
        console.log(`   👤 Criado por: ${grupo.criadoPor ? grupo.criadoPor.user?.name : 'DESCONHECIDO'}`);
        console.log(`   🆔 CriadoPorId: ${grupo.criadoPorId}`);
        console.log(`   👥 Membros: ${grupo.membros.length}`);
        console.log(`   📅 Criado em: ${grupo.criadoEm.toISOString()}`);
      });
    } else {
      console.log('❌ Nenhum grupo encontrado no sistema');
    }
    
    // 3. Listar grupos específicos do professor
    if (userPerfil) {
      console.log('\n🎯 === GRUPOS DO PROFESSOR ===');
      const gruposProfessor = await prisma.grupo.findMany({
        where: {
          criadoPorId: userPerfil.id
        },
        include: {
          membros: true
        }
      });
      
      console.log(`📊 Grupos do professor: ${gruposProfessor.length}`);
      
      if (gruposProfessor.length > 0) {
        gruposProfessor.forEach((grupo, index) => {
          console.log(`${index + 1}. 📁 ${grupo.nome} (${grupo.id})`);
          console.log(`   👥 ${grupo.membros.length} membros`);
        });
      } else {
        console.log('❌ Professor não tem grupos criados');
      }
    }
    
  } catch (error) {
    console.error('❌ Erro ao listar grupos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugListGroups();
