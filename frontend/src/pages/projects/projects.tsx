import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Project from "../../components/project/project";
import { Modal } from "../../components/modal/modal";
import ProjectForm from "../../components/projectForm/projectForm";
import Button from "../../components/button/button";
import { DELETE_ICON_URL, EDIT_ICON_URL } from "../../utils/icons";
import { createProject, deleteProject, getProjects, updateProject } from "../../services/projectService";
import type { Project as ProjectType, UserInfo } from "../../types";

import styles from "./projects.module.css";

type ProjectsPropsType = {
  user: UserInfo | null;
};

const Projects = ({ user }: ProjectsPropsType) => {
  const [projects, setProjects] = useState<Array<ProjectType>>([]);
  const [loading, setLoading] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectType | null>(null);
  const [isCreatingNewProject, setIsCreatingNewProject] = useState<boolean>(false);

  useEffect(() => {
    if (!user?.id) return;

    setLoading(true);
    getProjects()
      .then((res) => {
        const { projects } = res.data;
        setProjects(projects);
      })
      .catch((error) => {
        toast.error("Failed to load projects");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.id]);

  const handleEditButtonClick = (project: ProjectType) => {
    if (project) {
      setEditingProject(project);
    }
  };

  const handleCreateButtonClick = () => {
    setIsCreatingNewProject(true);
  };

  const handleProjectFormSubmit = (projectName: string) => {
    if (editingProject) {
      handleProjectUpdate(editingProject.id, projectName);
    } else {
      handleProjectCreate(projectName);
    }

    closeModal();
  };

  const handleProjectUpdate = async (editingProjectId: string, projectName: string) => {
    try {
      const response = await updateProject(editingProjectId, projectName);
      const { project: updatedProject } = response.data;

      toast.success("Project updated successfully");
      setProjects((prev) => {
        const index = prev.findIndex((project) => project.id === editingProjectId);
        const copiedProjects = [...prev];
        copiedProjects[index] = updatedProject;
        return copiedProjects;
      });
    } catch {
      toast.error("Failed to update the project");
    }
  };

  const handleProjectCreate = async (projectName: string) => {
    try {
      const response = await createProject(projectName);
      const { project } = response.data;

      toast.success("Project created successfully");
      setProjects((prev) => [...prev, project]);
    } catch {
      toast.error("Failed to create the project");
    }
  };

  const closeModal = () => {
    setEditingProject(null);
    setIsCreatingNewProject(false);
  };

  const handleDelete = async (projectId: string) => {
    try {
      await deleteProject(projectId);

      toast.success("Project deleted successfully");
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
    } catch {
      toast.error("Failed to delete the project");
    }
  };

  return (
    <div className={styles.projects}>
      <h2>Projects</h2>
      {user !== null && <Button onClick={handleCreateButtonClick}>Create new project</Button>}
      {user !== null && (
        <div className={styles["projects-container"]}>
          {loading && <p>Loading projects...</p>}
          {!loading && projects.length === 0 && <p>No projects found.</p>}
          {!loading && projects.length > 0 && (
            <div className={styles["projects-grid"]}>
              {projects.map((project) => (
                <Project
                  key={project.id}
                  project={project}
                  editIcon={EDIT_ICON_URL}
                  deleteIcon={DELETE_ICON_URL}
                  onEdit={() => handleEditButtonClick(project)}
                  onDelete={() => handleDelete(project.id)}
                ></Project>
              ))}
            </div>
          )}
        </div>
      )}
      {user === null && <p>Please login to view your projects</p>}
      {(editingProject !== null || isCreatingNewProject) && (
        <Modal onClose={closeModal}>
          <ProjectForm
            onCancel={closeModal}
            onSubmit={handleProjectFormSubmit}
            submitButtonText={editingProject ? "Update" : "Create"}
            formTitle={editingProject ? "Update Project" : "Create Project"}
            currentProjectName={editingProject ? editingProject.name : ""}
          />
        </Modal>
      )}
    </div>
  );
};

export default Projects;
