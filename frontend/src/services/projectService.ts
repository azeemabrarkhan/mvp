import http from "./httpService";
import config from "../config.json";

const projectsApiEndPoint = config.baseURL + config.projects;

export function getProjects() {
  return http.get(projectsApiEndPoint);
}

export function createProject(projectName: string) {
  return http.post(projectsApiEndPoint, { projectName });
}

export function updateProject(projectId: string, projectName: string) {
  return http.patch(`${projectsApiEndPoint}/${projectId}`, { projectName });
}

export function deleteProject(projectId: string) {
  return http.delete(`${projectsApiEndPoint}/${projectId}`);
}

export default {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
};
