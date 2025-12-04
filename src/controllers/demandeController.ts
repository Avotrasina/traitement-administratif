import { Request, Response } from "express";
import * as demandeService from "../sevices/demandeService";
import { configurationStorage } from "../config/storage.config";
import * as documentService from "../sevices/documentService";
import * as notificationService from "../sevices/notificaitonService"
import { types } from "node:util";
import { describe } from "node:test";

const multer = configurationStorage();

// Lister toutes les demandes
export async function getAllDemandes(req: Request, res: Response) {
  try {
    const demandes = await demandeService.getAllDemandes();
    return res.status(200).json(demandes);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}

// Chercher une demande par sa reference
export async function getDemandeByReference(req: Request, res: Response) {
  const ref: string = req.params.reference;
  if (!ref) {
    return res.status(404).json({ message: 'Demande introuvable' });
  }
  const demande = await demandeService.getDemandeByReference(ref);
  return res.status(200).json(demande);
}

// Mettre à jour une demande
export async function updateDemande(req: Request, res: Response) {
  
}
// Ajouter une nouvelle demande
export async function addDemande(req: Request, res: Response) {
  const { remarque, description } = req.body;
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
    remarque,
  };
  try {
    const user_demande = await demandeService.addDemande(newDemande);
    const reference: string = user_demande.reference as string;
    const qr_code: string = await demandeService.generateQr(reference);
    user_demande.qr_code = qr_code;
    
    // Update the qr_code
    const updated_demande = await demandeService.updateQrCodeDemande(
			user_demande.id,
			reference
		);

    const fichiers = req.files as Express.Multer.File[] | undefined ;
    if (!fichiers) {
      return res.status(400).json({message: "Les documents sont requis"});
    }
    const documents = fichiers?.map((fichier) => ({
			demande_id: updated_demande.id,
			nom_fichier: fichier.filename,
			chemin_fichier: fichier.path,
			type_fichier: fichier.mimetype,
			role_fichier: "justificatif",
		}));
    
    const docs = await documentService.addDocument(documents);

    // Notifier l'utilisateur
    const notification = await notificationService.createNotifiation({
			citoyen_id,
			demande_id: updated_demande.id,
			titre: `Demande ${updated_demande.types_demande?.nom}`,
			message: `Votre demande vient d'être soumise. Veuillez suivre votre dossier en utilisant la référence ${updated_demande.reference}.`,
		});

    return res.status(200).json({
      success: true,
      data: {
        demande: updated_demande,
        documents: docs
      }
    });

  } catch (error) {
    return res.status(500).json({ message: 'Inernal Server Error' });
  }
  
}

export async function getTypeDemandeById(req: Request, res: Response) {
  const id: number = Number(req.params.id);
  if (isNaN(id)) {
			return res.json(400).json({ message: "Id invalid" });
  }
  try {
    const type_demande = await demandeService.getTypeDemandeById(id);
    return res.status(200).json(type_demande);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
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


export async function addTypeDemande(req: Request, res: Response) {
  try {
    const { nom, description, delai_estime, pieces_requises } = req.body;
    if (!nom || !description || !delai_estime || !pieces_requises) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const types_demande = await demandeService.addTypeDemande({
      nom, description, delai_estime, pieces_requises
    });

    return res.status(200).json(types_demande);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
}

export async function updateTypeDemande(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { nom, description, pieces_requises, delai_estime } = req.body;
  if (isNaN(id)) {
    return res.status(400).json({ message: "Id invalid" });
  }
  try {
    const updatedTypeDemande = await demandeService.updateTypeDemande(id, {
      nom, description, pieces_requises, delai_estime
    })

    return res.status(200).json(updatedTypeDemande);

  } catch (error) {
    return res.status(500).json({message: "Erreur Serveur"});
  }

}

export async function deleteTypeDemande(req: Request, res: Response) {
  const id: number = Number(req.params.id);

  if (isNaN(id)) {
    return res.json(400).json({ message: "Id invalid" });
  }

  try {
    const deletedTypeDemande = await demandeService.deleteTypeDemande(id);
    return res.status(200).json({message: "Type de demande supprimee"});
  } catch (error) {
    return res.status(500).json({ message: "Erreur Serveur" });
  }
}
