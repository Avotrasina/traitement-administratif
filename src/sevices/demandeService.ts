import { Request, Response } from "express";
import prisma from "../lib/prisma.js";


export async function getDemandesByUser(user_id: number) {
	return await prisma.demandes.findMany({
		select: {
			id: true,
			types_demande: true,
			reference: true,
			description: true,
			qr_code: true,
			remarque: true,
			fichiers: true,
		},
		where: {
			citoyen_id: user_id,
		},
	});
}

export async function getTypesDemande() {
	return await prisma.types_demandes.findMany();
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
export async function updateStatutDemande(id: number, statut: string) {
	console.log(`id recu : ${id} statut recu ${statut}`);
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