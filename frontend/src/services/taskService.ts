import http from "./httpService";
import config from "../config.json";
import type { TaskStatus } from "../enums";

const tasksApiEndPoint = config.baseURL + config.projects;

export function getTasks(projectId: string) {
  return http.get(`${tasksApiEndPoint}/${projectId}/tasks`);
}

export function createTask(projectId: string, title: string, status: TaskStatus) {
  return http.post(`${tasksApiEndPoint}/${projectId}/tasks`, { title, status });
}

export function updateTask(projectId: string, taskId: string, title: string, status: TaskStatus) {
  return http.patch(`${tasksApiEndPoint}/${projectId}/tasks/${taskId}`, { title, status });
}

export function deleteTask(projectId: string, taskId: string) {
  return http.delete(`${tasksApiEndPoint}/${projectId}/tasks/${taskId}`);
}

export default {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
