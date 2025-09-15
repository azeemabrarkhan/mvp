import type { Task as TaskType } from "../../types";
import { getTimeDurationSince } from "../../utils/time";
import { TaskStatus } from "../../enums";

import styles from "./task.module.css";
import Button from "../button/button";

type TaskProps = {
  task: TaskType;
  editIcon: string;
  deleteIcon: string;
  onEdit: () => void;
  onDelete: () => void;
};

const Task = ({ task, editIcon, deleteIcon, onEdit, onDelete }: TaskProps) => {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.NEW:
        return styles["status-new"];
      case TaskStatus.IN_PROGRESS:
        return styles["status-in-progress"];
      case TaskStatus.DONE:
        return styles["status-done"];
      default:
        return styles["status-new"];
    }
  };

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.NEW:
        return "New";
      case TaskStatus.IN_PROGRESS:
        return "In Progress";
      case TaskStatus.DONE:
        return "Done";
      default:
        return "New";
    }
  };

  return (
    <div className={styles["task-card"]}>
      <div className={styles["task-header"]}>
        <div className={styles["task-title"]}>{task.title}</div>
        <div className={`${styles["task-status"]} ${getStatusColor(task.status)}`}>{getStatusText(task.status)}</div>
      </div>
      <div className={styles["task-meta"]}>{`Project Name: ${task.project.name}`}</div>
      <div className={styles["task-footer"]}>
        <div className={styles["task-dates"]}>
          <div>Created: {getTimeDurationSince(task.createdAt)}</div>
          <div>Updated: {getTimeDurationSince(task.updatedAt)}</div>
        </div>
        <div className={styles["task-buttons"]}>
          <Button url={editIcon} isRounded={true} onClick={onEdit}></Button>
          <Button url={deleteIcon} isRounded={true} onClick={onDelete}></Button>
        </div>
      </div>
    </div>
  );
};

export default Task;
