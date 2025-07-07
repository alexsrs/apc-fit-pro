// Debug temporário para entender o erro 500
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testGetUserGroups() {
  try {
    console.log('Iniciando teste de getUserGroups...');
    
    // Importar o schema de validação
    const { z } = require('zod');
    
    const membroSchema = z.object({
      id: z.string(),
      role: z.enum(['admin', 'aluno', 'professor']),
      telefone: z.string().nullable().optional(),
      dataNascimento: z.date(),
      genero: z.enum(['masculino', 'feminino', 'outro']),
      professorId: z.string().nullable().optional(),
      grupoId: z.string().nullable().optional(),
      userId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    });

    const grupoSchema = z.object({
      id: z.string(),
      nome: z.string(),
      criadoPorId: z.string(),
      criadoEm: z.date().default(() => new Date()),
      atualizadoEm: z.date().default(() => new Date()),
      membros: z.array(membroSchema).optional().default([]),
    });
    
    // Primeiro, verificar se existe algum usuário
    const users = await prisma.user.findMany({
      take: 1,
      select: {
        id: true,
        name: true,
        email: true,
        userPerfil: {
          select: {
            id: true,
            telefone: true,
            professorId: true,
            grupoId: true,
          }
        }
      }
    });

    console.log('Usuários encontrados:', users.length);

    if (users.length === 0) {
      console.log('Nenhum usuário encontrado no banco');
      return;
    }

    const userId = users[0].id;
    console.log(`Testando getUserGroups para userId: ${userId}`);

    // Primeiro buscar o UserPerfil.id baseado no User.id
    const userPerfil = await prisma.userPerfil.findUnique({
      where: { userId: userId },
      select: { id: true }
    });

    console.log('UserPerfil encontrado:', userPerfil);

    if (!userPerfil) {
      console.log('UserPerfil não encontrado para este usuário');
      return;
    }

    // Buscar grupos - usando o mesmo query do repository CORRIGIDO
    const grupos = await prisma.grupo.findMany({
      where: { criadoPorId: userPerfil.id },
      select: {
        id: true,
        nome: true,
        criadoPorId: true,
        criadoEm: true,
        atualizadoEm: true,
        membros: {
          select: {
            id: true,
            userId: true,
            role: true,
            telefone: true,
            dataNascimento: true,
            genero: true,
            professorId: true,
            grupoId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    console.log('Grupos encontrados:', grupos.length);

    // Simular o processGroup
    const processedGroups = grupos.map((group) => {
      console.log('Processando grupo:', group.id);
      
      try {
        const result = {
          ...grupoSchema.parse({
            ...group,
            criadoEm: group.criadoEm ?? new Date(),
            atualizadoEm: group.atualizadoEm ?? new Date(),
          }),
          membros: (group.membros ?? []).map((membro) => ({
            ...membro,
            professorId: membro.professorId ?? undefined,
          })),
        };
        
        console.log('Grupo processado com sucesso:', group.id);
        return result;
      } catch (error) {
        console.error('Erro ao processar grupo:', group.id, error);
        throw error;
      }
    });

    console.log('Todos os grupos processados com sucesso');
    
  } catch (error) {
    console.error('Erro detalhado:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testGetUserGroups();
