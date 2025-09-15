import { useEffect, useRef } from "react";
import Button from "../button/button";
import styles from "./projectForm.module.css";

type ProjectFormPropsType = {
  onSubmit: (projectName: string) => void;
  onCancel: () => void;
  submitButtonText: string;
  formTitle: string;
  currentProjectName: string;
};

const ProjectForm = ({
  onSubmit,
  onCancel,
  submitButtonText,
  formTitle,
  currentProjectName: currentProjectValue,
}: ProjectFormPropsType) => {
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.value = currentProjectValue;
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const form = e.currentTarget;
    const elements = form.elements as typeof form.elements & {
      projectName: HTMLInputElement;
    };
    const projectName = elements.projectName.value;

    onSubmit(projectName);
  };

  return (
    <form className={styles.projectForm} onSubmit={(e) => handleSubmit(e)}>
      <div className="row">
        <div className="column">
          <h2>{formTitle}</h2>
        </div>
      </div>
      <div className="row">
        <div className="column">
          <label htmlFor="projectName">Project Name</label>
          <input
            ref={nameInputRef}
            id="projectName"
            type="text"
            name="projectName"
            placeholder="Enter your project name"
            required
          />
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

export default ProjectForm;
