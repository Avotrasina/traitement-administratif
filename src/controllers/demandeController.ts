import { Request, Response } from "express";
import * as demandeService from "../sevices/demandeService.js";
import { configurationStorage } from "../config/storage.config.js";
import * as documentService from "../sevices/documentService.js";
import * as notificationService from "../sevices/notificaitonService.js"

const multer = configurationStorage();

// Chercher une demande par sa reference
export async function getDemandeByReference(req: Request, res: Response) {
  const ref: string = req.params.reference;
  if (!ref) {
    return res.status(404).json({ message: 'Demande introuvable' });
  }
  const demande = await demandeService.getDemandeByReference(ref);
  return res.status(200).json(demande);
}

// Lister toutes les demandes
export async function getDemandes(req: Request, res: Response) {
  const demandes = await demandeService.getDemandes();
  demandes.forEach((demande) => {
    //const fichiers
  })
  //const fichiers = await documentService.getDocuments(deman)
  return res.status(200).json(demandes);
}

// Ajouter une nouvelle demande
export async function addDemande(req: Request, res: Response) {
  const {  qr_code, remarque, description } = req.body;
  const citoyen_id: number = parseInt(req.body.citoyen_id);
  const type_id: number = parseInt(req.body.type_id);
  
  
  // Validate citoyen
  
  // Validate type

  // Insert demande first
  const newDemande = {
    citoyen_id,
    type_id,
    reference: "",
    description,
    qr_code,
    remarque,
  };
  console.log("New demande from Lico", newDemande);
  try {
    const demande = await demandeService.addDemande(newDemande);
    
    // Insertion fichier
    const fichiers = req.files as Express.Multer.File[] | undefined ;
    if (!fichiers) {
      return res.status(400).json({message: "Les documents sont requis"});
    }
    console.log("-------------->", fichiers);
    const documents = fichiers?.map((fichier) => ({
      demande_id: demande.id,
      nom_fichier: fichier.filename,
      chemin_fichier: fichier.path,
      type_fichier: fichier.mimetype,
      role_fichier: "justificatif"
    }));
    
    const docs = await documentService.addDocument(documents);

    // Notifier l'utilisateur
    const notification = await notificationService.createNotifiation({
			citoyen_id,
			demande_id: demande.id,
			titre: `Demande ${demande.types_demande?.nom}`,
			message: `Votre demande vient d'être soumise. Veuillez suivre votre dossier en utilisant la référence ${demande.reference}.`
		});

    return res.status(200).json({
      success: true,
      data: {
        demande: demande,
        documents: docs
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Inernal Server Error' });
  }
  
}

export async function getTypesDemande(req: Request, res: Response) {
  try {
    const types = await demandeService.getTypesDemande();
    return res.status(200).json(types);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

