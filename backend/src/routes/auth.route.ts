import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import authController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRoute = express.Router();

authRoute.post("/sign-up", asyncHandler(authController.signup));
authRoute.post("/login", asyncHandler(authController.login));
authRoute.post("/logout", asyncHandler(authController.logout));

export default authRoute;
