import http from "./httpService";
import config from "../config.json";

const adminApiEndPoint = config.baseURL + config.admin + config.users;

export function getUsers() {
  return http.get(adminApiEndPoint);
}

export function toggleUserStatus(userId: string) {
  return http.patch(`${adminApiEndPoint}/${userId}/block`);
}

export default {
  getUsers,
  toggleUserStatus,
};
