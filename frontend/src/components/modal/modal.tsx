import type { ReactNode } from "react";
import styles from "./modal.module.css";
import ReactDOM from "react-dom";

type ModalPropsType = {
  onClose: () => void;
  children: ReactNode;
};

export const Modal = ({ children, onClose }: ModalPropsType) => {
  const element = document.getElementById("modal");

  return element
    ? ReactDOM.createPortal(
        <div className={styles["modal-backdrop"]} onClick={onClose}>
          <div onClick={(e) => e.stopPropagation()}>{children}</div>
        </div>,
        element
      )
    : null;
};
