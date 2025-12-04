import prisma from "../lib/prisma";

export async function addDocument(documents: any) {
	const docs = await prisma.fichiers.createManyAndReturn({
		data: documents,
	});

	return docs;
}


export async function updateDocument(
	demande_id: number,
	documents: any[]
) {
	try {
		const result = await prisma.$transaction(async (tx) => {
			// 1. Delete old files
			await tx.fichiers.deleteMany({
				where: { demande_id },
			});

			// 2. Insert new files
			const newFiles = await tx.fichiers.createMany({
				data: documents.map((d) => ({
					...d,
					demande_id,
				})),
			});

			// 3. Return the updated demande + files
			const demande = await tx.demandes.findUnique({
				where: { id: demande_id },
				include: { fichiers: true },
			});

			return demande;
		});

		return result;
	} catch (error) {
		console.log(error);
	}
}

