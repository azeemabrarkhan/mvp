import { Response, NextFunction } from "express";
import { AuditAction, AuditResult, EntityType, Role } from "@prisma/client";
import logService, { AuditLogInput } from "../services/log.service.js";
import tasksService from "../services/tasks.service.js";
import projectsService from "../services/projects.service.js";
import { HTTP_RESPONSE_CODES } from "../enums/http-response-codes.js";
import { AuthRequest } from "../interfaces/authRequestAndPayload.js";
import { normalizeIp } from "../utils/ip.js";

class TasksController {
  async sendTasks(req: AuthRequest, res: Response, next: NextFunction) {
    const { user, params } = req;

    if (user && user.id && user.role) {
      const auditLog: AuditLogInput = {
        actorUserId: user.id,
        action: AuditAction.VIEW,
        entityType: EntityType.TASK,
        entityId: params.projectId,
        result: AuditResult.SUCCESS,
        ip: normalizeIp(req.ip ?? ""),
      };

      try {
        const tasks = await tasksService.getTasks(params.projectId, user.role === Role.ADMIN ? undefined : user.id);
        await logService.createLog(auditLog);
        res.status(HTTP_RESPONSE_CODES.OK).json({ tasks });
      } catch (err) {
        auditLog.result = AuditResult.FAILED;
        await logService.createLog(auditLog);
        next(err);
      }
    }
  }

  async createTask(req: AuthRequest, res: Response, next: NextFunction) {
    const { user, params } = req;
    const { title, status } = req.body;

    if (user && user.id) {
      const project = await projectsService.getProject(
        params.projectId,
        user.role === Role.ADMIN ? undefined : user.id
      );

      if (!project) {
        return res.status(HTTP_RESPONSE_CODES.FORBIDDEN).json({ error: "Forbidden" });
      }

      const task = await tasksService.createTask(params.projectId, title, status);
      res.status(HTTP_RESPONSE_CODES.CREATED).json({ task });
    }
  }

  async updateTask(req: AuthRequest, res: Response, next: NextFunction) {
    const { user, params } = req;
    const { title, status } = req.body;

    if (user && user.id) {
      const project = await projectsService.getProject(
        params.projectId,
        user.role === Role.ADMIN ? undefined : user.id
      );

      if (!project) {
        return res.status(HTTP_RESPONSE_CODES.FORBIDDEN).json({ error: "Forbidden" });
      }

      const task = await tasksService.updateTask(params.taskId, { title, status });
      res.status(HTTP_RESPONSE_CODES.OK).json({ task });
    }
  }

  async deleteTask(req: AuthRequest, res: Response, next: NextFunction) {
    const { user, params } = req;

    if (user && user.id) {
      const project = await projectsService.getProject(
        params.projectId,
        user.role === Role.ADMIN ? undefined : user.id
      );

      if (!project) {
        return res.status(HTTP_RESPONSE_CODES.FORBIDDEN).json({ error: "Forbidden" });
      }

      await tasksService.deleteTask(params.taskId);
      res.status(HTTP_RESPONSE_CODES.OK).send();
    }
  }
}

export default new TasksController();
