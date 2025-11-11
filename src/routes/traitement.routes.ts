import { Router } from "express";
import * as traitementController from "../controllers/traitementController";
const traitemnentRouter = Router();

traitemnentRouter.post('/demandes/:id/traitements', traitementController.faireTraitement);

export default traitemnentRouter;