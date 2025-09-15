import express from "express";
import adminController from "../controllers/admin.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleSwitch } from "../utils/roleSwitch.js";
import { Role } from "@prisma/client";

const adminRoute = express.Router();

adminRoute.get(
  "/users",
  authMiddleware,
  roleSwitch({
    [Role.ADMIN]: adminController.sendUsers,
  })
);

// adminRoute.get(
//   "/logs",
//   authMiddleware,
//   roleSwitch({
//     [Role.ADMIN]: adminController.sendUsers,
//   })
// ); get logs

adminRoute.patch(
  "/users/:userId/block",
  authMiddleware,
  roleSwitch({
    [Role.ADMIN]: adminController.toggleBlockUser,
  })
);

export default adminRoute;
