import { Request } from "express";
import { Role } from "@prisma/client";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}

export interface AuthPayload {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}
