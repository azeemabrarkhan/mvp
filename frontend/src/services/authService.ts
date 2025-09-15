import http from "./httpService";
import config from "../config.json";

const signUpApiEndPoint = config.baseURL + config.auth + "/sign-up";
const loginApiEndPoint = config.baseURL + config.auth + "/login";
const logoutApiEndPoint = config.baseURL + config.auth + "/logout";

export const userKey = "user";

export function signUp(user_email: string, user_pwd: string) {
  return http.post(signUpApiEndPoint, {
    user_email,
    user_pwd,
  });
}

export function login(user_email: string, user_pwd: string) {
  return http.post(loginApiEndPoint, {
    user_email,
    user_pwd,
  });
}

export function logout() {
  return http.post(logoutApiEndPoint);
}

export function getLocalUser() {
  const userString = localStorage.getItem(userKey);
  return userString ? JSON.parse(userString) : null;
}

export default {
  signUp,
  login,
  logout,
  getLocalUser,
};
