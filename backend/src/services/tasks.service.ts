import { prisma } from "../../prisma/client.js";
import { Task, TaskStatus } from "@prisma/client";

class TaskService {
  getTasks(projectId: string, ownerId?: string): Promise<Task[]> {
    return prisma.task.findMany({
      where: ownerId
        ? {
            project: {
              id: projectId,
              ownerId: ownerId,
            },
          }
        : {
            projectId,
          },
      include: {
        project: true,
      },
    });
  }

  createTask(projectId: string, title: string, status: TaskStatus): Promise<Task> {
    return prisma.task.create({
      data: { projectId, title, status },
      include: {
        project: true,
      },
    });
  }

  updateTask(taskId: string, updatedValues: Partial<Task>): Promise<Task | null> {
    return prisma.task.update({
      where: { id: taskId },
      data: { ...updatedValues },
      include: {
        project: true,
      },
    });
  }

  deleteTask(taskId: string): Promise<Task | null> {
    return prisma.task.delete({
      where: { id: taskId },
    });
  }
}

export default new TaskService();
