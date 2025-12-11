import { Router } from "express";
import * as demandeController from "../controllers/demandeController";
import { configurationStorage } from "../config/storage.config";

const demandeRouter = Router();
const multer = configurationStorage();
demandeRouter.get('/demandes', demandeController.getAllDemandes);

// Lister les demandes faites par un utilisateur
demandeRouter.post("/demandes/generate_pdf", demandeController.createPDF);
demandeRouter.get('/demandes/:reference', demandeController.getDemandeByReference);
demandeRouter.post('/demandes', multer.array("documents", 10), demandeController.addDemande);
demandeRouter.put('/demandes/:id', multer.array("documents", 10), demandeController.updateDemande);
demandeRouter.delete('/demandes/:id', demandeController.deleteDemande);
export default demandeRouter;