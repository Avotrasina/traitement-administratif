import { Router } from "express";
import * as demandeController from "../controllers/demandeController";


const types_demande_router = Router();

types_demande_router.get('/types_demande', demandeController.getTypesDemande);
types_demande_router.get('/types_demande/:id', demandeController.getTypeDemandeById);
types_demande_router.delete('/types_demande/:id', demandeController.deleteTypeDemande);
types_demande_router.put('/types_demande/:id', demandeController.updateTypeDemande);
types_demande_router.post('/types_demande', demandeController.addTypeDemande);

export default types_demande_router;