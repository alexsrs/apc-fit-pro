import { Request, Response } from 'express';
import { UsersService } from '../services/users-service';

const usersService = new UsersService();

// Usuários
export async function getUser(req: Request, res: Response) {
  const users = await usersService.getAllUsers();
  res.json(users);
}

export async function getUserById(req: Request, res: Response) {
  const id = req.params.id;
  const user = await usersService.getUserById(id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
}

export async function createUser(req: Request, res: Response) {
  const user = await usersService.createUser(req.body);
  res.status(201).json(user);
}

export async function updateUser(req: Request, res: Response) {
  const id = req.params.id;
  const user = await usersService.updateUser(id, req.body);
  res.json(user);
}

export async function deleteUser(req: Request, res: Response) {
  const id = req.params.id;
  await usersService.deleteUser(id);
  res.status(204).send();
}

// Perfis de usuário
export async function getUserProfiles(req: Request, res: Response) {
  const userId = req.params.id;
  const userProfiles = await usersService.getUserProfiles(userId);
  res.json(userProfiles);
}

export async function createUserProfile(req: Request, res: Response) {
  const userId = req.params.id;

  try {
    const userProfile = await usersService.createUserProfile(userId, req.body);
    res.status(201).json(userProfile);
  } catch (error: any) {
    if (error.message === "O professorId fornecido não é válido.") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Erro ao criar o perfil do usuário.", error });
    }
  }
}

export async function updateUserProfile(req: Request, res: Response) {
  const userId = req.params.id;
  const profileId = req.params.perfilId; // Certifique-se de que o nome do parâmetro corresponde ao definido na rota
  const data = req.body;

  try {
    const updatedProfile = await usersService.updateUserProfile(userId, profileId, data);
    if (!updatedProfile) {
      return res.status(404).json({ message: "Perfil não encontrado." });
    }
    res.json(updatedProfile);
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({ message: "Erro ao atualizar perfil." });
  }
}

export async function deleteUserProfile(req: Request, res: Response) {
  const userId = req.params.id;
  const profileId = req.params.profileId;
  const result = await usersService.deleteUserProfile(userId, profileId);
  res.json({ message: 'User profile deleted successfully' });
}

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
  const student = await usersService.updateUserStudent(userId, studentId, req.body);
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
