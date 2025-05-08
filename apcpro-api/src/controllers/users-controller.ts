import { Request, Response, NextFunction } from "express";
import { UsersService } from "../services/users-service";
import prisma from "../prisma";
import { ok, created, noContent, notFound } from "../utils/http-helper";
import { z } from "zod";
import { UserPerfil } from "@prisma/client";

const usersService = new UsersService();

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

// Usuários
export async function getUser(req: Request, res: Response) {
  try {
    const users = await usersService.getAllUsers();
    const response = await ok(users);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários.", error });
  }
}

export async function getUserById(req: Request, res: Response): Promise<void> {
  const userId = req.params.id;
  const user = await usersService.findUserById(userId);
  if (user === null || user === undefined) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.status(200).json(user);
}

export async function createUser(req: Request, res: Response): Promise<void> {
  const { id, name, email, image } = req.body;

  if (!id || !email) {
    res.status(400).json({ error: "ID e email são obrigatórios" });
  }

  try {
    const user = await prisma.user.upsert({
      where: { id },
      update: { name, email, image },
      create: { id, name, email, image },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const user = await usersService.updateUser(id, req.body);
    const response = await ok(user);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar usuário.", error });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const id = req.params.id;
    await usersService.deleteUser(id);
    const response = await noContent();
    res.status(response.statusCode).send();
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar usuário.", error });
  }
}

export async function getUserIdBySessionToken(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { sessionToken } = req.params;

    if (!sessionToken) {
      res.status(400).json({ error: "Session token is required" });
      return;
    }

    // Simulação de busca no banco de dados (substitua pelo Prisma ou outra lógica real)
    const userId = await usersService.findUserIdBySessionToken(sessionToken); // Função fictícia

    if (!userId) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Perfis de usuário
export async function getUserProfiles(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    const userProfiles = await usersService.getUserProfiles(userId);
    const response = await ok(userProfiles);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar perfis do usuário.", error });
  }
}

export async function createUserProfile(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    const userProfile = await usersService.createUserProfile(userId, req.body);
    const response = await created({
      ...userProfile,
      name: "",
      email: "",
      emailVerified: null,
      image: null,
      telefone: (userProfile as any).telefone ?? "", // Garante que telefone seja uma string válida
    });
    res.status(response.statusCode).json(response.body);
  } catch (error: any) {
    if (error.message === "O professorId fornecido não é válido.") {
      res.status(400).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Erro ao criar o perfil do usuário.", error });
    }
  }
}

export async function updateUserProfile(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { userId, profileData } = req.body;

    // Lógica para atualizar o perfil do usuário
    // Exemplo: Atualizar no banco de dados usando Prisma
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: profileData,
    });

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar o perfil do usuário.",
    });
  }
}

export async function deleteUserProfile(req: Request, res: Response) {
  const userId = req.params.id;
  const profileId = req.params.profileId;
  const result = await usersService.deleteUserProfile(userId, profileId);
  res.json({ message: "User profile deleted successfully" });
}

// Novo endpoint para buscar perfil do usuário por userId
export const getUserProfileByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.userId; // Obtém o ID do usuário da rota

    // Lógica para buscar o perfil do usuário
    const userProfile = await usersService.getUserProfile(userId);

    if (!userProfile) {
      res.status(404).json({ message: "Perfil não encontrado" });
      return;
    }

    res.status(200).json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const postUserProfileByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const { role, telefone, dataNascimento, genero, professorId, grupoId } =
      req.body;

    // Lógica para criar o perfil do usuário
    const profile = await usersService.createUserProfile(userId, {
      role,
      telefone,
      dataNascimento,
      genero,
      professorId,
      grupoId,
    });

    // Envia a resposta com o perfil criado
    res.status(201).json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

// Alunos relacionados
export async function getUserStudents(req: Request, res: Response) {
  const userId = req.params.id;
  const students = await usersService.getUserStudents(userId);
  res.json(students);
}

export async function addStudentToUser(req: Request, res: Response) {
  const userId = req.params.id;
  const student = await usersService.addStudentToUser(userId, req.body);
  res.status(201).json(student);
}

export async function updateUserStudent(req: Request, res: Response) {
  const userId = req.params.id;
  const studentId = req.params.alunoId;
  const student = await usersService.updateUserStudent(
    userId,
    studentId,
    req.body
  );
  res.json(student);
}

export async function removeStudentFromUser(req: Request, res: Response) {
  const userId = req.params.id;
  const studentId = req.params.alunoId;
  await usersService.removeStudentFromUser(userId, studentId);
  res.status(204).send();
}

// Grupos
export async function getUserGroups(req: Request, res: Response) {
  const userId = req.params.id;
  const groups = await usersService.getUserGroups(userId);
  res.json(groups);
}

export async function createUserGroup(req: Request, res: Response) {
  const userId = req.params.id;
  const group = await usersService.createUserGroup(userId, req.body);
  res.status(201).json(group);
}

export async function updateUserGroup(req: Request, res: Response) {
  const userId = req.params.id;
  const groupId = req.params.groupId;
  const group = await usersService.updateUserGroup(userId, groupId, req.body);
  res.json(group);
}

export async function deleteUserGroup(req: Request, res: Response) {
  const userId = req.params.id;
  const groupId = req.params.groupId;
  await usersService.deleteUserGroup(userId, groupId);
  res.status(204).send();
}
