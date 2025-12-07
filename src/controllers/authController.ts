import { Request, Response } from "express";
import * as userService from "../sevices/userService"
import * as resetPasswordService from "../sevices/resetPasswordService"
import { generateToken } from "../utils/jwt";
import { hashPassword, hashToken } from "../utils/bcrypt";
import sendEmail from "../sevices/emailService";
import crypto from "crypto";

// Reset the password
export async function reset_password(req: Request, res: Response) {
  const { token, nouveau_mot_de_passe } = req.body;
  if (!token || !nouveau_mot_de_passe) {
    return res.status(400).json({ message: "Token and password are required" });
  }

  try {
		// Find the token in the DB
    const tokenInfo = await resetPasswordService.findTokenInfo(token);
		if (!tokenInfo) {
			return res.status(404).json({ message: "Invalid or inexsting token" });
		}

		// Check if token is expired OR already used
    const expires_at = tokenInfo.expires_at as Date;
    const is_used = tokenInfo.is_used as boolean;
		const now = new Date();
		if (expires_at < now || is_used) {
			return res.status(400).json({ message: "Token expired or already used" });
		}

		// Update the password
		const hashedPassword = await hashPassword(nouveau_mot_de_passe);
    const updated_user = await userService.updateUser({
			id: tokenInfo.user_id,
			mot_de_passe: hashedPassword,
    });
    
    // Mark token as used
    const udpated_token_info = await resetPasswordService.makeTokenAsUsed(tokenInfo.id);

		return res
			.status(200)
			.json({ message: "Password reset", user: updated_user });
	} catch (error) {
    return res.status(500).json({message: "Internal Server", error})
  }
}


export async function forgot_password(req: Request, res: Response) {
  const user_email = req.body.email;

  // Vérifier que l'email existe
  const user = await userService.getUserByEmail(user_email);
  if (!user_email || !user) {
		return res
			.status(400)
			.json({ message: "Email is required and should exists" });
	}

  // Génerer un token
  const token: string = crypto.randomBytes(32).toString("hex");
  const hashedToken: String = await hashToken(token);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  try {
    
    // Envoyer token via à l'utilisateur
    const email_subject = "Réinitialisation de votre mot de passe";
    const email_content = `
    <h3>Utiliser ce lien pour accéder à la page de réinitialisation de votre mot de passe</h3>
    <p>Cliquez ce lien
    <a href="http://localhost:3000/reset-password?token=${hashedToken}">https://localhost:3000/reset-password?token=${hashedToken}</a>
    </p>
    
    `;

    const emailResponse = await sendEmail(
			user_email,
			email_subject,
			email_content
    );
    console.log(emailResponse);
    // Enregistre l'infomration dans la base
    const savedToken = await resetPasswordService.saveToken({
      user_id: user.id,
      token: hashedToken,
      expires_at: expiresAt
    });



    return res.status(201).json({ message: "Token generated and sent via email" });
  } catch (error) {
    return res.status(500).json({message: "Internal Server"})
  }


}