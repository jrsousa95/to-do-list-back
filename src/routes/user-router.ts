import { Router } from "express";
import userController from "../controllers/user-controller";

const userRouter = Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.post("/validate-token", userController.validateToken);

export default userRouter;
