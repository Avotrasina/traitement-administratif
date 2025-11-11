import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes";
import demandeRouter from "./routes/demande.routes";
import traitemnentRouter from "./routes/traitement.routes";
import notificationRouter from "./routes/notification.routes";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', userRouter);
app.use('/api', demandeRouter);
app.use('/api', traitemnentRouter);
app.use('/api', notificationRouter);

export default app;
