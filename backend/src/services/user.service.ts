import { prisma } from "../../prisma/client.js";
import { Role, User } from "@prisma/client";

class UserService {
  getUsers(): Promise<Omit<User, "passwordHash">[]> {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  getUserById(userId: string): Promise<Omit<User, "passwordHash"> | null> {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  createUser(email: string, passwordHash: string, role: Role = Role.USER): Promise<Omit<User, "passwordHash">> {
    return prisma.user.create({
      data: {
        email: email,
        passwordHash: passwordHash,
        role: role,
      },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  updateUser(userId: string, updatedValues: Partial<User>): Promise<Omit<User, "passwordHash"> | null> {
    return prisma.user.update({
      where: { id: userId },
      data: { ...updatedValues },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}

export default new UserService();
