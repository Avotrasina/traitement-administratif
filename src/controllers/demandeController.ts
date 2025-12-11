import { Request, Response } from "express";
import * as demandeService from "../sevices/demandeService";
import { configurationStorage } from "../config/storage.config";
import * as documentService from "../sevices/documentService";
import * as notificationService from "../sevices/notificaitonService"
import { randomUUID } from "crypto";
import { uploadFileToSupabase } from "../utils/uploadToSupabase";
import generatePDF from "../utils/generatePDF";
import { supabase } from "../lib/supabaseClient";
import { v4 as uuid } from "uuid";

export async function createPDF(req: Request, res: Response) {
  try {
		// Check the id
		const id_demande = Number(req.params.id);
		if (isNaN(id_demande)) {
			return res.status(400).json({ message: "Id invalid" });
    }
    
    console.log('id', id_demande);

		let enfant = req.body.enfant;
		let pere = req.body.pere;
		let mere = req.body.mere;
		let sage_femme = req.body.sage_femme;

		const pdfBuffer = await generatePDF(enfant, pere, mere, sage_femme);

		// 2. Create unique filename
		const filename = `acte_naissance_${uuid()}.pdf`;

		// 3. Upload to Supabase Storage
		const { data: uploadData, error: uploadError } = await supabase.storage
			.from("images")
			.upload(filename, pdfBuffer, {
				contentType: "application/pdf",
				upsert: false,
			});

		if (uploadError) {
			console.error(uploadError);
			return res.status(500).json({ error: "Upload to Supabase failed" });
		}

		// 4. Get public URL or signed URL
		const { data: publicUrlData } = supabase.storage
			.from("images")
			.getPublicUrl(filename);

		const fileUrl = publicUrlData.publicUrl;
    console.log(fileUrl);
		// 5. Save file metadata into PostgreSQL
		const meta = await documentService.addDocument([
			{
				nom_fichier: filename,
				chemin_fichier: fileUrl,
				type_fichier: "application/pdf",
				demande_id: id_demande, 
				role_fichier: "document_final"
			},
		]);

		// 6. Return link to client
		return res.json({
			message: "Acte de naissance créée",
			fichier: meta,
		});
	} catch (error) {
    console.error(error);
    res.status(500).json({error});
  }
}


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

export async function addDemande(req: Request, res: Response) {
  const { remarque, description } = req.body;
  const citoyen_id: number = Number(req.body.citoyen_id);
  const type_id: number = Number(req.body.type_id);
  
  if (isNaN(type_id) || isNaN(citoyen_id) || !remarque || !description) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

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
    const updated_demande = await demandeService.udpateDemande({
      id: user_demande.id,
      qr_code
    });

    const fichiers = req.files as Express.Multer.File[] | undefined ;
    if (!fichiers) {
      return res.status(400).json({message: "Les documents sont requis"});
    }

    const documents: any[] = []

    for (const fichier of fichiers) {
			// Upload to Supabase
			const ext = fichier.originalname.split(".").pop(); // keep extension
			const encodedName = `${randomUUID()}.${ext}`;

			const publicUrl = await uploadFileToSupabase(
				fichier,
				`demande/${updated_demande.reference}/${encodedName}`
			);

			documents.push({
				demande_id: updated_demande.id,
				nom_fichier: encodedName,
				chemin_fichier: publicUrl,
				type_fichier: fichier.mimetype,
				role_fichier: "justificatif",
			});
		}

    const docs = await documentService.addDocument(documents);

    // Attach the files
    updated_demande.fichiers = docs as any

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
			},
		});

  } catch (error) {
    return res.status(500).json({ message: 'Inernal Server Error', error });
  }
  
}

// Mettre à jour une demande
export async function updateDemande(req: Request, res: Response) {
  const demande_id = Number(req.params.id);
  if (isNaN(demande_id)) {
    return res.status(400).json({ message: "Id demande invalide" });
  }

  const { remarque, description } = req.body;
	const citoyen_id: number = parseInt(req.body.citoyen_id);
  const type_id: number = parseInt(req.body.type_id); 

  const newDemande = {
    id: demande_id,
		citoyen_id,
		type_id,
    description,
    statut: "soumise",
		remarque,
  };
  
  try {
		const user_demande = await demandeService.udpateDemande(newDemande);

		const fichiers = req.files as Express.Multer.File[] | undefined;
		if (!fichiers) {
			return res.status(400).json({ message: "Les documents sont requis" });
		}
		

    const documents: any[] = [];

		for (const fichier of fichiers) {
			// Upload to Supabase
			const ext = fichier.originalname.split(".").pop(); // keep extension
			const encodedName = `${randomUUID()}.${ext}`;

			const publicUrl = await uploadFileToSupabase(
				fichier,
				`demande/${user_demande.reference}/${encodedName}`
			);

			documents.push({
				demande_id: user_demande.id,
				nom_fichier: encodedName,
				chemin_fichier: publicUrl,
				type_fichier: fichier.mimetype,
				role_fichier: "justificatif",
			});
		}


		//const docs = await documentService.addDocument(documents);
    const updated_demande = await documentService.updateDocument(demande_id, documents);
    
		// Notifier l'utilisateur
		const notification = await notificationService.createNotifiation({
			citoyen_id,
			demande_id: user_demande.id,
			titre: `Demande ${user_demande.types_demande?.nom}`,
			message: `Votre demande vient d'être modifié. Veuillez suivre votre dossier en utilisant la référence ${user_demande.reference}.`,
		});

		return res.status(200).json({
			success: true,
			data: {
				demande: updated_demande,
			},
		});
  } catch (error) {
		return res.status(500).json({ message: "Inernal Server Error", error });
	}
}

// Supprimer une demande
export async function deleteDemande(req: Request, res: Response) {
  const demande_id = Number(req.params.id);
  if (isNaN(demande_id)) {
    return res.status(400).json({ message: "Id demande invalide" });
  }

  // Check if Demande exists
  try {
    const demande = await demandeService.getDemandeById(demande_id);
    if (!demande) {
      return res.status(404).json({ message: "Demande not found" });
    }
  
    // Delete demande
    const deleted_demande = await demandeService.deleteDemande(demande_id);
    return res.status(200).json({ message: "Demande deleted" });
  } catch (error) {
    return res.status(500).json({ messsage: "Internal Error", error });
  }

}

// Ajouter une nouvelle demande
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
