import { Request, Response } from "express";
import * as userService from "../sevices/userService";
import * as demandeService from "../sevices/demandeService";
import * as traitementService from "../sevices/traitementService";
import * as notificationService from "../sevices/notificaitonService"
export async function getTraitements() {

}


export async function faireTraitement(req: Request, res: Response) {
  const demande_id = Number(req.params.id);
  const agent_id = Number(req.body.agent_id);
  const { action, commentaire } = req.body;
  if (isNaN(agent_id) || isNaN(demande_id) || !userService.getUserById(agent_id) || !demandeService.getDemandeById(demande_id)) {
    return res.status(400).json({ message: 'Identifiants invalides' });
  }
  
  if (!action || !commentaire) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }
  
  let nouveauStatut: string = "";
  // Changer statut de la demande
  switch (action) {
		default:
			nouveauStatut = "soumise";
			break;

		case "verification":
			nouveauStatut = "approuvee";
			break;

		case "validation":
			nouveauStatut = "en cours";
			break;

		case "finition":
			nouveauStatut = "prete";
			break;

		case "recuperation":
			nouveauStatut = "remise";
			break;
	}

  if (nouveauStatut === "soumise") {
    return res.status(400).json({ message: 'Action requise pour faire le traitement' });
  }  

  try {
    // Mettre à jour la demande
    const demande_traitee = await demandeService.updateStatutDemande(demande_id, nouveauStatut);
    console.error(`Demande traitee : ${demande_traitee.statut}`);
    // Ajouter le traitement
    const traitement = await traitementService.makeTraitement({
      demande_id: demande_id,
      agent_id: agent_id,
      action: action,
      commentaire: commentaire
    });
    
    const estPrete: boolean = nouveauStatut === "prete";
    let msg: string = "";

    if (estPrete) {
      msg = `Votre document est prêt.
         Veuillez suivre le récupérer au bureau. Reference : ${traitement.demandes?.reference}.`;
    } else {
      msg = `Votre document est ${nouveauStatut}. Veuillez suivre tout le temps l'état de votre demande. Reference : ${traitement.demandes?.reference}.`;
    }

    // Notifier le client
    const notification = await notificationService.createNotifiation({
			citoyen_id: traitement.demandes?.citoyen_id,
			demande_id: traitement.demandes?.id,
			titre: `Demande ${traitement.demandes?.reference}`,
			message: msg
		});
    
    return res.status(201).json(traitement);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error });
  }

}