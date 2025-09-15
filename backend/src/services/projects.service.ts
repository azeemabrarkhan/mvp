import { Project } from "@prisma/client";
import { prisma } from "../../prisma/client.js";

class ProjectService {
  getProjects(ownerId?: string): Promise<Project[]> {
    return prisma.project.findMany({
      where: ownerId ? { ownerId } : undefined,
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  createProject(ownerId: string, projectName: string): Promise<Project> {
    return prisma.project.create({
      data: { ownerId, name: projectName },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  getProject(projectId: string, ownerId?: string): Promise<Project | null> {
    return prisma.project.findFirst({
      where: ownerId ? { id: projectId, ownerId } : { id: projectId },
    });
  }

  updateProject(projectId: string, name: string, ownerId?: string): Promise<Project | null> {
    return prisma.project.update({
      data: { name },
      where: ownerId ? { id: projectId, ownerId } : { id: projectId },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  deleteProject(projectId: string, ownerId?: string): Promise<Project | null> {
    return prisma.project.delete({
      where: ownerId ? { id: projectId, ownerId } : { id: projectId },
    });
  }
}

export default new ProjectService();
