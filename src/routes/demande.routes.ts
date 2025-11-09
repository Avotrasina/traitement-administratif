import { Router } from "express";
import * as demandeController from "../controllers/demandeController";

const demandeRouter = Router();

demandeRouter.get('/demandes', demandeController.getDemandes);
demandeRouter.post('/demandes', demandeController.addDemande);

export default demandeRouter;