import type { Role, Status, TaskStatus } from "../enums";

export type UserInfo = { id: string; email: string; role: Role };

export type User = { id: string; email: string; role: Role; status: Status; createdAt: string; updatedAt: string };

export type Project = { id: string; name: string; ownerId: string; createdAt: string; updatedAt: string; owner: User };

export type Task = {
  id: string;
  projectId: string;
  title: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  project: Project;
};

export type customError = any & { status: number; error: string };
