import prisma from "../lib/prisma";

export async function makeTraitement(traitement: any) {
	return await prisma.traitements.create({
		data: traitement,
		select: {
			id: true,
			demandes: true,
			agent_id: true,
			action: true,
			commentaire: true,
			date_action: true,
		},
	});
}
