import { Response, NextFunction } from "express";
import { HTTP_RESPONSE_CODES } from "../enums/http-response-codes.js";
import { AuthRequest } from "../interfaces/authRequestAndPayload.js";
import projectsService from "../services/projects.service.js";
import logService, { AuditLogInput } from "../services/log.service.js";
import { AuditAction, AuditResult, EntityType, Role } from "@prisma/client";
import { normalizeIp } from "../utils/ip.js";

class ProjectsController {
  async sendProjects(req: AuthRequest, res: Response, next: NextFunction) {
    const { user } = req;

    if (user && user.id && user.role) {
      const auditLog: AuditLogInput = {
        actorUserId: user.id,
        action: AuditAction.VIEW,
        entityType: EntityType.PROJECT,
        result: AuditResult.SUCCESS,
        ip: normalizeIp(req.ip ?? ""),
      };

      try {
        const projects = await projectsService.getProjects(user.role === Role.ADMIN ? undefined : user.id);
        await logService.createLog(auditLog);
        res.status(HTTP_RESPONSE_CODES.OK).json({ projects });
      } catch (err) {
        auditLog.result = AuditResult.FAILED;
        await logService.createLog(auditLog);
        next(err);
      }
    }
  }

  async createProject(req: AuthRequest, res: Response, next: NextFunction) {
    const { user } = req;
    const { projectName } = req.body;

    if (user && user.id) {
      const project = await projectsService.createProject(user.id, projectName);
      res.status(HTTP_RESPONSE_CODES.CREATED).json({ project });
    }
  }

  async updateProject(req: AuthRequest, res: Response, next: NextFunction) {
    const { user, params } = req;
    const { projectName } = req.body;

    if (user && user.id) {
      const project = await projectsService.updateProject(
        params.projectId,
        projectName,
        user.role === Role.ADMIN ? undefined : user.id
      );
      res.status(HTTP_RESPONSE_CODES.OK).json({ project });
    }
  }

  async deleteProject(req: AuthRequest, res: Response, next: NextFunction) {
    const { user, params } = req;

    if (user && user.id) {
      await projectsService.deleteProject(params.projectId, user.role === Role.ADMIN ? undefined : user.id);
      res.status(HTTP_RESPONSE_CODES.OK).send();
    }
  }
}

export default new ProjectsController();
