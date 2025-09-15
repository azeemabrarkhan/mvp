import { Request, Response, NextFunction } from "express";
import { HTTP_RESPONSE_CODES } from "../enums/http-response-codes.js";
import { AuthRequest } from "../interfaces/authRequestAndPayload.js";
import { AuditAction, AuditResult, EntityType, Status } from "@prisma/client";
import userService from "../services/user.service.js";
import logService, { AuditLogInput } from "../services/log.service.js";
import { normalizeIp } from "../utils/ip.js";

class AdminController {
  async sendUsers(req: Request, res: Response, next: NextFunction) {
    const users = await userService.getUsers();
    res.status(HTTP_RESPONSE_CODES.OK).json({ users });
  }

  async toggleBlockUser(req: AuthRequest, res: Response, next: NextFunction) {
    const { user, params } = req;

    if (user && user.id) {
      const userToUpdate = await userService.getUserById(params.userId);

      if (userToUpdate) {
        const newStatus = userToUpdate.status === Status.ACTIVE ? Status.BLOCKED : Status.ACTIVE;

        const auditLog: AuditLogInput = {
          actorUserId: user.id,
          action: newStatus === Status.ACTIVE ? AuditAction.UNBLOCK : AuditAction.BLOCK,
          entityType: EntityType.USER,
          entityId: params.userId,
          result: AuditResult.SUCCESS,
          ip: normalizeIp(req.ip ?? ""),
        };

        if (user.id !== params.userId) {
          try {
            const updatedUser = await userService.updateUser(params.userId, { status: newStatus });
            await logService.createLog(auditLog);
            res.status(HTTP_RESPONSE_CODES.OK).json({ users: updatedUser });
          } catch (err) {
            auditLog.result = AuditResult.FAILED;
            await logService.createLog(auditLog);
            next(err);
          }
        } else {
          auditLog.result = AuditResult.FAILED;
          await logService.createLog(auditLog);
          res.status(HTTP_RESPONSE_CODES.BAD_REQUEST).json({ error: "You cannot block yourself" });
        }
      }
    }
  }
}

export default new AdminController();
