import { login, userKey } from "../../services/authService";
import Form from "../../components/form/form";

import styles from "./login.module.css";
import { toast } from "react-toastify";
import { HTTP_RESPONSE_CODES } from "../../enums";

const Login = () => {
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login(email, password);

      const { user } = response.data;
      localStorage.setItem(userKey, JSON.stringify(user));
      window.location.href = "/";
    } catch (err: any) {
      localStorage.removeItem(userKey);
      err?.status === HTTP_RESPONSE_CODES.FORBIDDEN
        ? toast.error("Your account has been disabled. Please contact support.")
        : toast.error("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className={styles.login}>
      <h2>Login</h2>
      <Form submitButtonText="Login" onSubmit={handleLogin} />
    </div>
  );
};

export default Login;
