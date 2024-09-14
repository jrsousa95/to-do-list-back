import { Router } from "express";
import { auth } from "../middlewares/authMiddleware";
import { taskController } from "../controllers/task-controller";

const taskRouter = Router();

taskRouter.post("/task", auth.verifyToken, taskController.createTask);
taskRouter.get("/tasks", auth.verifyToken, taskController.getTasks);
taskRouter.put("/tasks/:id", auth.verifyToken, taskController.updateTask);
taskRouter.delete("/tasks/:id", auth.verifyToken, taskController.deleteTask);

export default taskRouter;
