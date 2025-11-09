import { Request, Response } from "express";
import * as demandeService from "../sevices/demandeService";


// Lister toutes les demandes
export async function getDemandes(req: Request, res: Response) {
  const demandes = await demandeService.getDemandes();
  return res.status(200).json(demandes);
}

// Ajouter une nouvelle demande
export async function addDemande(req: Request, res: Response) {
  const { citoyen_id, type_id, qr_code, remarque } = req.body;
}