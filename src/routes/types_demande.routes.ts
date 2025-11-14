import { Router } from "express";
import * as demandeController from "../controllers/demandeController.js";


const types_demande_router = Router();

types_demande_router.get('/types_demande', demandeController.getTypesDemande);

export default types_demande_router;