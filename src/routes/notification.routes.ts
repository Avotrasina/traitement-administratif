import { Router } from "express";
import * as notificationController from "../controllers/notificationController.js"

const notificationRouter = Router();

notificationRouter.get('/api/notifications', notificationController.getNotifiations);
notificationRouter.post('/api/notifications', notificationController.createNotification)
notificationRouter.patch('/api/notifications/:id', notificationController.markAsRead);



export default notificationRouter;