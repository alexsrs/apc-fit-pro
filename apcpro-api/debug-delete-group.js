const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugDeleteGroup() {
  try {
    console.log('🔍 === DEBUG EXCLUSÃO DE GRUPO ===');
    
    // IDs do erro
    const userId = 'cmbpudp780000v07cqw1p7esm';
    const groupId = 'fee35673-9c8c-40f0-aa62-bb232bd36674';
    
    console.log(`📋 Testando exclusão:`);
    console.log(`   userId: ${userId}`);
    console.log(`   groupId: ${groupId}`);
    
    // 1. Verificar se o usuário existe
    console.log('\n1️⃣ Verificando usuário...');
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    console.log(`   Usuário encontrado: ${user ? user.name : 'NÃO ENCONTRADO'}`);
    
    // 2. Verificar perfil do usuário
    console.log('\n2️⃣ Verificando perfil do usuário...');
    const userPerfil = await prisma.userPerfil.findFirst({
      where: { userId: userId }
    });
    console.log(`   Perfil encontrado: ${userPerfil ? `${userPerfil.role} (ID: ${userPerfil.id})` : 'NÃO ENCONTRADO'}`);
    
    // 3. Verificar se o grupo existe
    console.log('\n3️⃣ Verificando grupo...');
    const grupo = await prisma.grupo.findUnique({
      where: { id: groupId },
      include: {
        membros: true,
        criadoPor: {
          include: {
            user: true
          }
        }
      }
    });
    
    if (grupo) {
      console.log(`   Grupo encontrado: ${grupo.nome}`);
      console.log(`   Criado por ID: ${grupo.criadoPorId}`);
      console.log(`   Membros: ${grupo.membros.length}`);
      console.log(`   Criador: ${grupo.criadoPor ? grupo.criadoPor.user?.name : 'DESCONHECIDO'}`);
      
      // Listar membros
      if (grupo.membros.length > 0) {
        console.log(`   👥 Membros do grupo:`);
        for (const membro of grupo.membros) {
          console.log(`     - ${membro.id} (UserPerfil)`);
        }
      }
    } else {
      console.log(`   ❌ Grupo NÃO ENCONTRADO`);
    }
    
    // 4. Verificar se o perfil do usuário criou o grupo
    if (userPerfil && grupo) {
      console.log('\n4️⃣ Verificando permissão...');
      const permissao = grupo.criadoPorId === userPerfil.id;
      console.log(`   Perfil criou o grupo: ${permissao ? '✅ SIM' : '❌ NÃO'}`);
      console.log(`   Comparação: ${grupo.criadoPorId} === ${userPerfil.id}`);
    }
    
    // 5. Tentar exclusão REAL
    console.log('\n5️⃣ Executando exclusão...');
    if (userPerfil && grupo && grupo.criadoPorId === userPerfil.id) {
      console.log('   🗑️ EXECUTANDO EXCLUSÃO...');
      
      try {
        // Simular a mesma lógica do repository
        const result = await prisma.$transaction(async (tx) => {
          console.log(`   🔄 Removendo ${grupo.membros.length} membros do grupo`);
          
          // 1. Remover todos os membros do grupo
          await tx.grupo.update({
            where: { id: groupId },
            data: {
              membros: {
                set: [] 
              }
            }
          });

          // 2. Deletar o grupo
          const grupoExcluido = await tx.grupo.delete({
            where: { id: groupId }
          });

          console.log(`   ✅ Grupo ${groupId} excluído com sucesso`);
          return grupoExcluido;
        });
        
        console.log('   ✅ Exclusão realizada com sucesso:', result.nome);
      } catch (deleteError) {
        console.error('   ❌ Erro na exclusão:', deleteError);
      }
    } else {
      console.log('   ❌ Exclusão seria NEGADA');
      if (!userPerfil) console.log('     - Perfil não encontrado');
      if (!grupo) console.log('     - Grupo não encontrado');
      if (userPerfil && grupo && grupo.criadoPorId !== userPerfil.id) {
        console.log('     - Usuário não é o criador do grupo');
      }
    }
    
  } catch (error) {
    console.error('❌ Erro no debug:', error);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

debugDeleteGroup();
