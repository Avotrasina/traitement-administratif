import { Router } from "express";
import * as userController from "./../controllers/userController";
import * as authController from "./../controllers/authController"
import { authenticateToken, AuthRequest } from "../middlewares/authMiddleware";

const authRouter = Router();

authRouter.get("/hello", authenticateToken, (req: AuthRequest, res) => {
	res.json({ message: "Welcome", user: req.user });
});

authRouter.post("/auth/forgot-password", authController.forgot_password);
authRouter.post("/auth/reset-password", authController.reset_password);


authRouter.post("/register", userController.createUser);
authRouter.post("/login", userController.authenticate);
authRouter.post("/logout", userController.logout);



export default authRouter;