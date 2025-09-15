import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { createTask, deleteTask, getTasks, updateTask } from "../../services/taskService";
import Task from "../../components/task/task";
import type { Task as TaskType, UserInfo } from "../../types";
import { DELETE_ICON_URL, EDIT_ICON_URL } from "../../utils/icons";

import styles from "./tasks.module.css";
import { TaskStatus } from "../../enums";
import TaskForm from "../../components/taskFrom/taskForm";
import { Modal } from "../../components/modal/modal";
import Button from "../../components/button/button";

type TasksPropsType = {
  user: UserInfo | null;
};

const Tasks = ({ user }: TasksPropsType) => {
  const { projectId } = useParams<{ projectId: string }>();
  const [tasks, setTasks] = useState<Array<TaskType>>([]);
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [isCreatingNewTask, setIsCreatingNewTask] = useState<boolean>(false);

  useEffect(() => {
    if (!user?.id || !projectId) return;

    setLoading(true);
    getTasks(projectId)
      .then((res) => {
        const { tasks } = res.data;
        setTasks(tasks);
      })
      .catch((error) => {
        toast.error("Failed to load tasks");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.id, projectId]);

  const handleEditButtonClick = (task: TaskType) => {
    if (task) {
      setEditingTask(task);
    }
  };

  const handleCreateButtonClick = () => {
    setIsCreatingNewTask(true);
  };

  const handleTaskFormSubmit = (title: string, status: TaskStatus) => {
    if (!projectId) return;

    if (editingTask) {
      handleTaskUpdate(projectId, editingTask.id, title, status);
    } else {
      handleTaskCreate(projectId, title, status);
    }

    closeModal();
  };

  const handleTaskUpdate = async (projectId: string, taskId: string, title: string, status: TaskStatus) => {
    try {
      const response = await updateTask(projectId, taskId, title, status);
      const { task: updatedTask } = response.data;

      toast.success("Task updated successfully");
      setTasks((prev) => {
        const index = prev.findIndex((task) => task.id === taskId);
        const copiedTasks = [...prev];
        copiedTasks[index] = updatedTask;
        return copiedTasks;
      });
    } catch {
      toast.error("Failed to update the task");
    }
  };

  const handleTaskCreate = async (projectId: string, title: string, status: TaskStatus) => {
    try {
      const response = await createTask(projectId, title, status);
      const { task } = response.data;

      toast.success("Task created successfully");
      setTasks((prev) => [...prev, task]);
    } catch {
      toast.error("Failed to create the task");
    }
  };

  const closeModal = () => {
    setEditingTask(null);
    setIsCreatingNewTask(false);
  };

  const handleDelete = async (projectId: string, taskId: string) => {
    try {
      await deleteTask(projectId, taskId);

      toast.success("Task deleted successfully");
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch {
      toast.error("Failed to delete the task");
    }
  };

  return (
    <div className={styles.tasks}>
      <h2>Tasks</h2>
      <Button onClick={handleCreateButtonClick}>Create new task</Button>
      <div className={styles.header}>
        <Link to="/" className={styles["back-link"]}>
          ← Back to Projects
        </Link>
      </div>
      <div className={styles["tasks-container"]}>
        {loading && <p>Loading tasks...</p>}
        {!loading && tasks.length === 0 && <p>No tasks found for this project.</p>}
        {!loading && tasks.length > 0 && (
          <div className={styles["tasks-grid"]}>
            {tasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                editIcon={EDIT_ICON_URL}
                deleteIcon={DELETE_ICON_URL}
                onEdit={() => handleEditButtonClick(task)}
                onDelete={() => handleDelete(task.project.id, task.id)}
              ></Task>
            ))}
          </div>
        )}
      </div>
      {(editingTask !== null || isCreatingNewTask) && (
        <Modal onClose={closeModal}>
          <TaskForm
            onCancel={closeModal}
            onSubmit={handleTaskFormSubmit}
            submitButtonText={editingTask ? "Update" : "Create"}
            formTitle={editingTask ? "Update Task" : "Create Task"}
            taskTitle={editingTask ? editingTask.title : ""}
            taskStatus={editingTask ? editingTask.status : TaskStatus.NEW}
          />
        </Modal>
      )}
    </div>
  );
};

export default Tasks;
