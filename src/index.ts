import app from "./app.js";
import { Request, Response } from "express";
const PORT = process.env.PORT || 8000;


app.listen(PORT, () => {
	console.log(`Server running on port : ${PORT}`);
});
