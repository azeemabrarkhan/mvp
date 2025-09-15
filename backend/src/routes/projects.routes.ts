import express from "express";
import projectsController from "../controllers/projects.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const projectsRoute = express.Router();

projectsRoute.get("/", authMiddleware, asyncHandler(projectsController.sendProjects));
projectsRoute.post("/", authMiddleware, asyncHandler(projectsController.createProject));
projectsRoute.patch("/:projectId", authMiddleware, asyncHandler(projectsController.updateProject));
projectsRoute.delete("/:projectId", authMiddleware, asyncHandler(projectsController.deleteProject));

export default projectsRoute;
