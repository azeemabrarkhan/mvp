import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import projectsRoute from "./routes/projects.routes.js";
import tasksRoute from "./routes/tasks.route.js";
import adminRoute from "./routes/admin.route.js";
import { handleError } from "./middlewares/error.middleware.js";
import { CONSTANTS } from "./constants.js";

const app = express();

app.set("trust proxy", true);

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: CONSTANTS.FRONTEND_ADDRESS,
    methods: ["POST", "GET", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use("/auth", authRoute);
app.use("/projects", projectsRoute);
app.use("/projects/:projectId/tasks", tasksRoute);
app.use("/admin", adminRoute);
app.use(handleError);

try {
  app.listen(CONSTANTS.API_PORT, () => console.info(`Server running on port ${CONSTANTS.API_PORT}`));
} catch (err) {
  console.error("DB connection error:", err);
  process.exit(1);
}
