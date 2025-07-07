/**
 * Utilitário para debug e teste dos relacionamentos de grupos
 */

import prisma from '../prisma';

export class DebugGrupos {
  
  // Verificar estado atual das tabelas
  static async verificarEstadoAtual() {
    console.log('\n=== DEBUG GRUPOS - Estado Atual ===');
    
    try {
      // 1. Verificar usuários
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true }
      });
      console.log('👥 Users encontrados:', users.length);
      users.forEach((u: any) => console.log(`  - ${u.name} (${u.id})`));
      
      // 2. Verificar perfis de usuários
      const perfis = await prisma.userPerfil.findMany({
        include: { 
          user: { select: { name: true } } 
        }
      });
      console.log('\n📋 UserPerfils encontrados:', perfis.length);
      perfis.forEach((p: any) => console.log(`  - ${p.user.name} (${p.id}) - Role: ${p.role} - Professor: ${p.professorId} - Grupo: ${p.grupoId}`));
      
      // 3. Verificar grupos
      const grupos = await prisma.grupo.findMany({
        select: { 
          id: true, 
          nome: true, 
          criadoPorId: true 
        }
      });
      console.log('\n🏷️ Grupos encontrados:', grupos.length);
      grupos.forEach((g: any) => console.log(`  - ${g.nome} (${g.id}) - Criado por: ${g.criadoPorId}`));
      
      // 4. Verificar relacionamentos na tabela _MembroGrupo
      const relacionamentos = await prisma.$queryRaw`
        SELECT * FROM "_MembroGrupo"
      ` as any[];
      console.log('\n🔗 Relacionamentos _MembroGrupo:', relacionamentos.length);
      relacionamentos.forEach((r: any) => console.log(`  - Grupo: ${r.A} -> Membro: ${r.B}`));
      
      // 5. Verificar grupos com membros usando include
      const gruposComMembros = await prisma.grupo.findMany({
        include: {
          membros: {
            include: { user: { select: { name: true } } }
          },
          criadoPor: {
            include: { user: { select: { name: true } } }
          }
        }
      });
      console.log('\n👥 Grupos com membros (via include):');
      gruposComMembros.forEach((g: any) => {
        console.log(`  - ${g.nome} (criado por: ${g.criadoPor?.user?.name || 'N/A'})`);
        g.membros.forEach((m: any) => console.log(`    → ${m.user.name} (${m.id})`));
      });
      
      return {
        users,
        perfis,
        grupos,
        relacionamentos,
        gruposComMembros
      };
      
    } catch (error) {
      console.error('❌ Erro ao verificar estado atual:', error);
      throw error;
    }
  }
  
  // Testar adição de aluno ao grupo
  static async testarAdicaoAluno(grupoId: string, alunoId: string) {
    console.log(`\n=== TESTE: Adicionando aluno ${alunoId} ao grupo ${grupoId} ===`);
    
    try {
      // 1. Verificar se o grupo existe
      const grupo = await prisma.grupo.findUnique({
        where: { id: grupoId },
        include: { membros: true }
      });
      
      if (!grupo) {
        console.log('❌ Grupo não encontrado');
        return false;
      }
      
      console.log(`✅ Grupo encontrado: ${grupo.nome}`);
      console.log(`📊 Membros atuais: ${grupo.membros.length}`);
      
      // 2. Verificar se o aluno existe
      const aluno = await prisma.userPerfil.findUnique({
        where: { id: alunoId },
        include: { user: true, grupos: true }
      });
      
      if (!aluno) {
        console.log('❌ Aluno não encontrado');
        return false;
      }
      
      console.log(`✅ Aluno encontrado: ${aluno.user.name}`);
      console.log(`📊 Grupos atuais do aluno: ${aluno.grupos.length}`);
      
      // 3. Verificar se já está no grupo
      const jaEstaNoGrupo = grupo.membros.some((m: any) => m.id === alunoId);
      if (jaEstaNoGrupo) {
        console.log('⚠️ Aluno já está no grupo');
        return true;
      }
      
      // 4. Adicionar ao grupo
      console.log('🔄 Adicionando aluno ao grupo...');
      const grupoAtualizado = await prisma.grupo.update({
        where: { id: grupoId },
        data: {
          membros: {
            connect: { id: alunoId }
          }
        },
        include: { membros: { include: { user: true } } }
      });
      
      console.log('✅ Aluno adicionado com sucesso!');
      console.log(`📊 Novos membros do grupo: ${grupoAtualizado.membros.length}`);
      grupoAtualizado.membros.forEach((m: any) => console.log(`  → ${m.user.name}`));
      
      return true;
      
    } catch (error) {
      console.error('❌ Erro ao testar adição:', error);
      return false;
    }
  }
  
  // Testar remoção de aluno do grupo
  static async testarRemocaoAluno(grupoId: string, alunoId: string) {
    console.log(`\n=== TESTE: Removendo aluno ${alunoId} do grupo ${grupoId} ===`);
    
    try {
      const grupoAtualizado = await prisma.grupo.update({
        where: { id: grupoId },
        data: {
          membros: {
            disconnect: { id: alunoId }
          }
        },
        include: { membros: { include: { user: true } } }
      });
      
      console.log('✅ Aluno removido com sucesso!');
      console.log(`📊 Membros restantes: ${grupoAtualizado.membros.length}`);
      
      return true;
      
    } catch (error) {
      console.error('❌ Erro ao testar remoção:', error);
      return false;
    }
  }
  
  // Criar dados de teste
  static async criarDadosTeste() {
    console.log('\n=== CRIANDO DADOS DE TESTE ===');
    
    try {
      // Buscar professor existente
      const professor = await prisma.userPerfil.findFirst({
        where: { role: 'professor' },
        include: { user: true }
      });
      
      if (!professor) {
        console.log('❌ Nenhum professor encontrado');
        return;
      }
      
      console.log(`✅ Professor encontrado: ${professor.user.name}`);
      
      // Criar grupo de teste se não existir
      let grupoTeste = await prisma.grupo.findFirst({
        where: { nome: 'Grupo Teste Debug' }
      });
      
      if (!grupoTeste) {
        grupoTeste = await prisma.grupo.create({
          data: {
            nome: 'Grupo Teste Debug',
            criadoPorId: professor.id
          }
        });
        console.log(`✅ Grupo de teste criado: ${grupoTeste.nome}`);
      } else {
        console.log(`✅ Grupo de teste já existe: ${grupoTeste.nome}`);
      }
      
      // Buscar alunos do professor
      const alunos = await prisma.userPerfil.findMany({
        where: { 
          professorId: professor.userId, // Usar userId aqui
          role: 'aluno' 
        },
        include: { user: true }
      });
      
      console.log(`📚 Alunos do professor: ${alunos.length}`);
      
      if (alunos.length > 0) {
        const primeiroAluno = alunos[0];
        console.log(`🎯 Testando com aluno: ${primeiroAluno.user.name}`);
        
        // Testar adição
        await this.testarAdicaoAluno(grupoTeste.id, primeiroAluno.id);
        
        // Verificar estado final
        await this.verificarEstadoAtual();
      } else {
        console.log('⚠️ Nenhum aluno encontrado para testar');
      }
      
    } catch (error) {
      console.error('❌ Erro ao criar dados de teste:', error);
    }
  }
}
