import { Request, Response } from "express";
import * as notificationService from "../sevices/notificaitonService";

export async function getNotifiations(req: Request, res: Response) {
  const user_id : number = Number(req.params.id);
  if (isNaN(user_id)) {
    return res.status(404).json({ message: "User id invalid" });
  }
  try {
    const notifs = await notificationService.getNotifiations(user_id);
    return res.status(200).json(notifs);
  } catch (error) {
    
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

// Delete notification
export async function deleteNotification(req: Request, res: Response) {
  const notif_id: number = Number(req.params.id);
  if (isNaN(notif_id)) {
    return res.status(400).json({ messag: 'Notificaion ID invalide' });
  }

  try {
		const notification = await notificationService.deleteNotification(
			notif_id
		);
		return res.status(200).json({ message: "Notification supprime" });
	} catch (error) {
		return res.status(500).json({ msessage: "Internal Server Error" });
	}
}


export async function markAsRead(req: Request, res: Response) {
  const notif_id: number = Number(req.params.id);
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