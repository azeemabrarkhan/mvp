export enum HTTP_RESPONSE_CODES {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum Status {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export enum TaskStatus {
  NEW = "NEW",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export enum AuditAction {
  LOGIN = "LOGIN",
  VIEW = "VIEW",
  BLOCK = "BLOCK",
  UNBLOCK = "UNBLOCK",
}

export enum EntityType {
  USER = "USER",
  PROJECT = "PROJECT",
  TASK = "TASK",
}

export enum AuditResult {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}
