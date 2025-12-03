import bcrypt from "bcrypt";

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

// Hash tokens

export async function hashToken(token: string): Promise<String> {
	const hashedToken = await bcrypt.hash(token, SALT_ROUNDS);
	return hashedToken;
}


// Hash passwords
export async function hashPassword(mot_de_passe: string): Promise<String> {
  const hashedPassword = await bcrypt.hash(mot_de_passe, SALT_ROUNDS);
  return hashedPassword;  
}

// Compare passwords
export async function comparePassword(
	plain: string,
	hash: string
): Promise<boolean> {
	return await bcrypt.compare(plain, hash);
}
