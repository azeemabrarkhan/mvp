import { prisma } from "../../prisma/client.js";
import { AuditLog } from "@prisma/client";

export type AuditLogInput = Partial<Pick<AuditLog, "actorUserId" | "entityType" | "entityId">> &
  Pick<AuditLog, "action" | "result" | "ip">;

class LogService {
  getLogs(): Promise<AuditLog[]> {
    return prisma.auditLog.findMany();
  }

  createLog(auditLog: AuditLogInput): Promise<AuditLog> {
    return prisma.auditLog.create({
      data: {
        actorUserId: auditLog.actorUserId ?? null,
        entityType: auditLog.entityType ?? null,
        entityId: auditLog.entityId ?? null,
        action: auditLog.action,
        result: auditLog.result,
        ip: auditLog.ip,
      },
    });
  }
}

export default new LogService();
