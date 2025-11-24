import { Router } from "express";
import * as notificationController from "../controllers/notificationController"

const notificationRouter = Router();

// Lister les notifications d'un user
notificationRouter.get('/notifications/user/:id', notificationController.getNotifiations);

// Créer une notification
notificationRouter.post('/notifications', notificationController.createNotification)

// Marquer la notification comme lue
notificationRouter.patch('/notifications/:id/lu', notificationController.markAsRead);

// Supprimer une notification
notificationRouter.delete('/notifications/:id', notificationController.deleteNotification);


export default notificationRouter;