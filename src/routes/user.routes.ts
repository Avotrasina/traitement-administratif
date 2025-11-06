import { Router } from "express";
import * as userController from "./../controllers/userController.js";

const router = Router();

router.get('/hello', userController.hello)

router.get('/users', userController.showUsers)
router.get('/users/:id', userController.getById)
router.post('/register', userController.createUser)
router.get('/login', userController.hello)

export default router;