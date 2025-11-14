import { Router } from "express";
import * as userController from "./../controllers/userController";
import { authenticateToken, AuthRequest } from "../middlewares/authMiddleware";

const userRouter = Router();

userRouter.get("/hello", authenticateToken, (req: AuthRequest, res) => {
	res.json({ message: "Welcome", user: req.user });
});


// Routes for users
userRouter.get('/users', userController.showUsers);
userRouter.get('/users/:id', userController.getById);
userRouter.get('/users/:id/demandes', userController.getDemandeByUser);
userRouter.put('/users/:id', userController.updateUser);

userRouter.delete('/users/:id', userController.deleteUser);
userRouter.post('/register', userController.createUser);
userRouter.post('/login', userController.authenticate);
userRouter.post('/logout', userController.logout);



export default userRouter;