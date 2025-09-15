import { Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { asyncHandler } from "./asyncHandler.js";
import { AuthRequest } from "../interfaces/authRequestAndPayload.js";
import { HTTP_RESPONSE_CODES } from "../enums/http-response-codes.js";

type RoleHandler = Partial<Record<Role, (req: AuthRequest, res: Response, next: NextFunction) => Promise<any>>>;

export const roleSwitch = (handlers: RoleHandler) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const role = req.user?.role;

    if (role && handlers[role]) {
      return asyncHandler(handlers[role])(req, res, next);
    }

    return res.status(HTTP_RESPONSE_CODES.FORBIDDEN).json({ error: "Forbidden" });
  };
};
