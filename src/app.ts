import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

import userRouter from "./routes/user.routes";
import demandeRouter from "./routes/demande.routes";
import traitemnentRouter from "./routes/traitement.routes";
import notificationRouter from "./routes/notification.routes";
import types_demande_router from "./routes/types_demande.routes";
import authRouter from "./routes/auth.routes";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "../uploads/")));
app.use('/api', userRouter);
app.use('/api/', authRouter)
app.use('/api', demandeRouter);
app.use('/api', traitemnentRouter);
app.use('/api', notificationRouter);
app.use("/api", types_demande_router);

export default app;
