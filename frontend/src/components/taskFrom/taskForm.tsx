import { useEffect, useRef } from "react";
import Button from "../button/button";
import styles from "./taskForm.module.css";
import { TaskStatus } from "../../enums";

type TaskFormPropsType = {
  onSubmit: (taskTitle: string, taskStatus: TaskStatus) => void;
  onCancel: () => void;
  submitButtonText: string;
  formTitle: string;
  taskTitle: string;
  taskStatus: TaskStatus;
};

const TaskForm = ({ onSubmit, onCancel, submitButtonText, formTitle, taskTitle, taskStatus }: TaskFormPropsType) => {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const statusSelectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (titleInputRef.current && statusSelectRef.current) {
      titleInputRef.current.value = taskTitle;
      statusSelectRef.current.value = taskStatus;
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const form = e.currentTarget;
    const elements = form.elements as typeof form.elements & {
      taskTitle: HTMLInputElement;
      taskStatus: HTMLSelectElement;
    };
    const taskTitle = elements.taskTitle.value;
    const taskStatus = elements.taskStatus.value;

    if (Object.keys(TaskStatus).includes(taskStatus)) {
      onSubmit(taskTitle, taskStatus as TaskStatus);
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
    <form className={styles.taskForm} onSubmit={(e) => handleSubmit(e)}>
      <div className="row">
        <div className="column">
          <h2>{formTitle}</h2>
        </div>
      </div>
      <div className="row">
        <div className="column">
          <label htmlFor="taskTitle">Task Title</label>
          <input
            ref={titleInputRef}
            id="taskTitle"
            type="text"
            name="taskTitle"
            placeholder="Enter your task title"
            required
          />
        </div>
      </div>
      <div className="row">
        <div className="column">
          <label htmlFor="taskStatus">Task Status</label>
          <select ref={statusSelectRef} name="taskStatus" id="taskStatus">
            {Object.keys(TaskStatus).map((taskStatus) => (
              <option key={taskStatus} value={taskStatus}>
                {getStatusText(taskStatus as TaskStatus)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="row">
        <div className="column">
          <div className={styles.buttons}>
            <Button type="button" onClick={onCancel} isSecondary={true}>
              Cancel
            </Button>
            <Button type="submit">{submitButtonText}</Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default TaskForm;
