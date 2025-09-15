import Button from "../button/button";
import { getTimeDurationSince } from "../../utils/time";
import type { User as UserType } from "../../types";
import { Status, Role } from "../../enums";

import styles from "./user.module.css";

type UserPropsType = {
  user: UserType;
  isUpdating: boolean;
  onStatusToggle: () => void;
};

const User = ({ user, isUpdating, onStatusToggle }: UserPropsType) => {
  const getStatusColor = (status: Status) => {
    return status === Status.ACTIVE ? styles["status-active"] : styles["status-blocked"];
  };

  const getStatusText = (status: Status) => {
    return status === Status.ACTIVE ? "Active" : "Blocked";
  };

  const getRoleColor = (role: Role) => {
    return role === Role.ADMIN ? styles["role-admin"] : styles["role-user"];
  };

  return (
    <div className={styles["user-card"]}>
      <div className={styles["user-header"]}>
        <div className={styles["user-email"]}>{user.email}</div>
        <div className={styles["user-badges"]}>
          <div className={`${styles["user-role"]} ${getRoleColor(user.role)}`}>{user.role}</div>
          <div className={`${styles["user-status"]} ${getStatusColor(user.status)}`}>{getStatusText(user.status)}</div>
        </div>
      </div>
      <div className={styles["user-dates"]}>
        <div>Created: {getTimeDurationSince(user.createdAt)}</div>
        <div>Updated: {getTimeDurationSince(user.updatedAt)}</div>
      </div>
      <div className={styles["user-actions"]}>
        {user.role !== Role.ADMIN && (
          <Button onClick={onStatusToggle} isDisabled={isUpdating} isSecondary={user.status === Status.ACTIVE}>
            {user.status === Status.ACTIVE ? "Block User" : "Unblock User"}
          </Button>
        )}
        {isUpdating && <span className={styles["updating-text"]}>Updating...</span>}
      </div>
    </div>
  );
};

export default User;
