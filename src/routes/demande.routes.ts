import { Router } from "express";
import * as demandeController from "../controllers/demandeController.js";
import { configurationStorage } from "../config/storage.config.js";

const demandeRouter = Router();
const multer = configurationStorage();
demandeRouter.get('/demandes', demandeController.getDemandes);
demandeRouter.get('/demandes/:reference', demandeController.getDemandeByReference);
demandeRouter.post('/demandes', multer.array("documents", 10), demandeController.addDemande);

export default demandeRouter;