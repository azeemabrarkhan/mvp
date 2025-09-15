import { useNavigate } from "react-router-dom";
import { signUp } from "../../services/authService";
import Form from "../../components/form/form";

import styles from "./register.module.css";
import { toast } from "react-toastify";
import type { customError } from "../../types";
import { HTTP_RESPONSE_CODES } from "../../enums";

const Register = () => {
  const navigate = useNavigate();

  const handleRegisteration = async (email: string, password: string) => {
    try {
      await signUp(email, password);
      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (err: customError) {
      if (err?.status === HTTP_RESPONSE_CODES.CONFLICT) {
        toast.error("Email already registered. Please log in.");
        navigate("/login");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className={styles.register}>
      <h2>Register</h2>
      <Form submitButtonText="Register" onSubmit={handleRegisteration} />
    </div>
  );
};

export default Register;
