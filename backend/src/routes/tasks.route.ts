import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import tasksController from "../controllers/tasks.controller.js";

const tasksRoute = express.Router({ mergeParams: true });

tasksRoute.get("/", authMiddleware, asyncHandler(tasksController.sendTasks));
tasksRoute.post("/", authMiddleware, asyncHandler(tasksController.createTask));
tasksRoute.patch("/:taskId", authMiddleware, asyncHandler(tasksController.updateTask));
tasksRoute.delete("/:taskId", authMiddleware, asyncHandler(tasksController.deleteTask));

export default tasksRoute;
