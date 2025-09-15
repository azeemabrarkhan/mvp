import type { ReactNode } from "react";
import styles from "./button.module.css";

type ButtonPropsType = {
  children?: ReactNode;
  onClick?: () => void;
  url?: string;
  type?: "button" | "submit" | "reset";
  isDisabled?: boolean;
  isRounded?: boolean;
  isSecondary?: boolean;
};

const Button = ({ children, onClick, url, type, isDisabled, isRounded, isSecondary }: ButtonPropsType) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (onClick) {
      onClick();
    }
  };
  return (
    <button
      type={type || "button"}
      className={`button ${styles.button} ${isRounded ? styles.rounded : ""} ${isSecondary ? "secondary" : ""}`}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {url && <div className={styles.content} style={{ backgroundImage: url }}></div>}
      {children !== undefined ? children : null}
    </button>
  );
};

export default Button;
