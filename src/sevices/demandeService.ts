import { Request, Response } from "express";
import prisma from "../lib/prisma";


// Lister toutes les demandes
export async function getDemandes() {
  return await prisma.demandes.findMany();
}

// Ajouter une nouvelle demande

// Mettre à jour une demande

// Supprimer une demane

// Rechercher une demande