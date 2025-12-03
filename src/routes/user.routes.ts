import { Router } from "express";
import * as userController from "./../controllers/userController";
import { authenticateToken, AuthRequest } from "../middlewares/authMiddleware";

const userRouter = Router();




// Routes for users
userRouter.get('/users', userController.showUsers);
userRouter.get('/users/:id', userController.getById);
userRouter.get('/users/:id/demandes', userController.getDemandeByUser);
userRouter.put('/users/:id', userController.updateUser);

userRouter.delete('/users/:id', userController.deleteUser);




export default userRouter;