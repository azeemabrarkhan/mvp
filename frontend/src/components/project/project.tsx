import type { Project as ProjectType } from "../../types";
import { getTimeDurationSince } from "../../utils/time";

import styles from "./projects.module.css";
import Button from "../button/button";
import { useNavigate } from "react-router-dom";

type ProjectPropsType = {
  project: ProjectType;
  editIcon: string;
  deleteIcon: string;
  onEdit: () => void;
  onDelete: () => void;
};

const Project = ({ project, editIcon, deleteIcon, onEdit, onDelete }: ProjectPropsType) => {
  const navigate = useNavigate();

  return (
    <div className={styles["project-card"]} onClick={() => navigate(`/projects/${project.id}`)}>
      <div className={styles["project-name"]}>{project.name}</div>
      <div className={styles["project-meta"]}>{`Owner Email: ${project.owner.email}`}</div>
      <div className={styles["project-footer"]}>
        <div className={styles["project-dates"]}>
          <div>Created: {getTimeDurationSince(project.createdAt)}</div>
          <div>Updated: {getTimeDurationSince(project.updatedAt)}</div>
        </div>
        <div className={styles["project-buttons"]}>
          <Button url={editIcon} isRounded={true} onClick={onEdit}></Button>
          <Button url={deleteIcon} isRounded={true} onClick={onDelete}></Button>
        </div>
      </div>
    </div>
  );
};

export default Project;
