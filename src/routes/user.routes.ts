import { Router } from "express";
import * as userController from "./../controllers/userController.js";

const router = Router();

router.get('/hello', userController.hello)


// Routes for users
router.get('/users', userController.showUsers)
router.get('/users/:id', userController.getById)
router.put('/users/:id', userController.updateUser)
router.delete('/users/:id', userController.deleteUser);
router.post('/register', userController.createUser)
router.get('/login', userController.authenticate)

export default router;