import jwt from "jsonwebtoken";

const JWT_SECRET =
	process.env.JWT_SECRET || "cdfd0cbeed19e6f5b7e84af11598f43db19f2bd0";

export function generateToken(user_id: number): string {
	return jwt.sign({ user_id }, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyToken(token: string): any {
	return jwt.verify(token, JWT_SECRET);
}