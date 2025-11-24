import prisma from "../lib/prisma";

// Get all notifications
export async function getNotifiations(user_id : number) {
	// Notifications avec filtre
	return await prisma.notifications.findMany({
		select: {
			id: true,
			citoyen_id: true,
			demande_id: true,
			titre: true,
			message: true,
			statut: true,
			created_at: true,
		},
		where: { users: {id: user_id} },
	});
}

// Creer une notification
export async function createNotifiation(notif: any) {
	return await prisma.notifications.create({
		data: notif,
		select: {
			id: true,
			citoyen_id: true,
			demande_id: true,
			titre: true,
			message: true,
			statut: true,
			created_at: true,
		},
	});
}

// Supprimer une notification
export async function deleteNotification(notif_id: number) {
	return await prisma.notifications.delete({
		where: {id: notif_id},
	})
}

// Changer le statut de la notification
export async function markNotificationAsRead(notif_id: number) {
	return await prisma.notifications.update({
		where: {
			id: notif_id,
		},
		data: {
			statut: "lu",
		},
	});
}
