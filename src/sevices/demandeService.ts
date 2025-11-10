import { Request, Response } from "express";
import prisma from "../lib/prisma";


// Chercher une demande par son reference
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
      type_id: true,
      description: true,
      qr_code: true,
      remarque: true
    }
  });
  return demande;
}
// Mettre à jour une demande

// Supprimer une demane

// Rechercher une demande