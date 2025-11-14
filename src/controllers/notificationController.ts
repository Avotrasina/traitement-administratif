import { Request, Response } from "express";
import * as notificationService from "../sevices/notificaitonService";

export async function getNotifiations(req: Request, res: Response) {
  const statut: string = req.params.statut || "" ;
    try {
      const notifications = await notificationService.getNotifiations(statut);
      return res.status(200).json(notifications);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Interal Server Error' });
    }
}

export async function createNotification(req: Request, res: Response) {
  const { titre, message } = req.body;
  const citoyen_id = Number(req.body.citoyen_id);
  const demande_id = Number(req.body.demande_id);
  if (isNaN(citoyen_id) || isNaN(demande_id) || !titre || !message) {
    return res.status(400).json({ message: 'Veuillez à bien renseigner tous les champs' });
  }
}


export async function markAsRead(req: Request, res: Response) {
  const notif_id: number = Number(req.query.id);
  if (isNaN(notif_id)) {
    return res.status(400).json({ messag: 'Notificaion ID invalide' });
  }

  try {
    const notification = await notificationService.markNotificationAsRead(notif_id);
    return res.status(200).json({ message: 'Notification lu' });
  } catch (error) {
    return res.status(500).json({ msessage: 'Internal Server Error' });
  }

}