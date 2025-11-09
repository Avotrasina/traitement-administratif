import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes";
import demandeRouter from "./routes/demande.routes";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', userRouter);
app.use('/api', demandeRouter);

export default app;
