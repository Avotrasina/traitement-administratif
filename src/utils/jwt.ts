import jwt from "jsonwebtoken";

const JWT_SECRET =
	process.env.JWT_SECRET || "cdfd0cbeed19e6f5b7e84af11598f43db19f2bd0";

export function generateToken(user: any): string {
	return jwt.sign({
		id: user.id,
		nom: user.nom,
		cin: user.cin,
		adresse: user.adresse,
		prenom: user.prenom,
		email: user.email,
		role: user.role,
		telephone: user.telephone
	 }, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyToken(token: string): any {
	return jwt.verify(token, JWT_SECRET);
}