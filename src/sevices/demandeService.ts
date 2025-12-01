import prisma from "../lib/prisma";
import QRCode from "qrcode"

export async function generateQr(reference: string) {
	const url = `${process.env.URL_BASE}/api/demandes/${reference}`;

	const qr = await QRCode.toDataURL(url);
	return qr; // base64 string
}

export async function getAllDemandes() {
		return await prisma.demandes.findMany({
			select: {
				id: true,
				types_demande: true,
				user: true,
				reference: true,
				description: true,
				qr_code: true,
				statut: true,
				remarque: true,
				fichiers: true,
				date_soumission: true
			}
		})
		
}

export async function getDemandesByUser(user_id: number) {
	return await prisma.demandes.findMany({
		select: {
			id: true,
			types_demande: true,
			user: true,
			reference: true,
			description: true,
			qr_code: true,
			statut: true,
			remarque: true,
			fichiers: true,
			date_soumission: true
		},
		where: {
			citoyen_id: user_id,
		},
	});
}

// Type demande
export async function addTypeDemande(data: any) {
	return await prisma.types_demandes.create({
		data,
		select: {
			id: true,
			nom: true,
			description: true,
			delai_estime: true,
			pieces_requises: true,
		},
	});
}

export async function getTypeDemandeById(id: number) {
	return await prisma.types_demandes.findUnique({
		where: { id },
		select: {
			id: true,
			nom: true,
			description: true,
			delai_estime: true,
			pieces_requises: true,
		},
	});
}

export async function getTypesDemande() {
	return await prisma.types_demandes.findMany();
}

export async function updateTypeDemande(id: number, data: any) {
	return await prisma.types_demandes.update({
		where: { id },
		data: data,
		select: {
			id: true,
			nom: true,
			description: true,
			delai_estime: true,
			pieces_requises: true,
		},
	});
}

export async function deleteTypeDemande(id: number) {
	return await prisma.types_demandes.delete({
		where: { id },
	})
}

export async function getDemandeByReference(ref: string) {
	return await prisma.demandes.findUnique({
		where: { reference: ref },
		select: {
			id: true,
			types_demande: true,
			user: {
				select: {
					id: true,
					nom: true,
					prenom: true,
					email: true,
					role: true,
					adresse: true,
					cin: true,
					telephone: true,
					date_inscription: true,
				}
			},
			fichiers: true,
			reference: true,
			description: true,
			qr_code: true,
			remarque: true,
		},
	});
}

// Chercher une demande par son reference
export async function getDemandeById(id: number) {
  return await prisma.demandes.findUnique({
		where: { id: id },
		select: {
			id: true,
			types_demande: true,
			user: {
				select: {
					id: true,
					nom: true,
					prenom: true,
					email: true,
					role: true,
					adresse: true,
					cin: true,
					telephone: true,
					date_inscription: true,
				},
			},
			reference: true,
			description: true,
			qr_code: true,
			remarque: true,
		},
	});
}


// Lister toutes les demandes
export async function getDemandes() {
  return await prisma.demandes.findMany({
		select: {
			id: true,
			types_demande: true,
			user: {
				select: {
					id: true,
					nom: true,
					prenom: true,
					email: true,
					role: true,
					adresse: true,
					cin: true,
					telephone: true,
					date_inscription: true,
				},
			},
			fichiers: true,
			reference: true,
			description: true,
			qr_code: true,
			remarque: true,
		},
	});
}

// Ajouter une nouvelle demande
export async function addDemande(newDemande: any) {
  const demande = await prisma.demandes.create({
    data: newDemande,
    select: {
      id: true,
      reference: true,
      citoyen_id: true,
      types_demande: true,
			description: true,
			statut: true,
      qr_code: true,
      remarque: true
		}
  });
  return demande;
}

// Mettre à jour une demande
export async function udpateDemande(id: number, demande: any) {
	const updated_demande = await prisma.demandes.update({
		where: {id},
		data: demande,
		select: {
			id: true,
			reference: true,
			citoyen_id: true,
			types_demande: true,
			description: true,
			statut: true,
			qr_code: true,
			remarque: true,
		},
	});
	return updated_demande;
}

export async function updateQrCodeDemande(id: number, qr_code: string) {
		return await prisma.demandes.update({
			where: {
				id: id,
			},
			data: {
				qr_code,
			},
			select: {
				id: true,
				reference: true,
				citoyen_id: true,
				types_demande: true,
				description: true,
				statut: true,
				qr_code: true,
				remarque: true,
			},
		});
}

// Mettre à jour une demande
export async function updateStatutDemande(id: number, statut: string) {
	return await prisma.demandes.update({
		where: {
			id: id,
		},
		data: {
			statut,
		},
		select: {
			id: true,
			reference: true,
			types_demande: true,
			citoyen_id: true,
			type_id: true,
			description: true,
			statut: true,
			qr_code: true,
			remarque: true,
		},
	});
}

// Supprimer une demane

// Rechercher une demande