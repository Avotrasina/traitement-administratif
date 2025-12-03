import { Request, Response } from "express";
import * as userService from "../sevices/userService"
import * as resetPasswordService from "../sevices/resetPasswordService"
import { generateToken } from "../utils/jwt";
import { hashToken } from "../utils/bcrypt";
import { sendEmail } from "../sevices/emailService";
import crypto from "crypto";


export async function forgot_password(req: Request, res: Response) {
  const user_email = req.body.email;
  console.log("email recu", user_email);

  // Vérifier que l'email existe
  const user = await userService.getUserByEmail(user_email);
  if (!user_email || !user) {
		return res
			.status(400)
			.json({ message: "Email is required and should exists" });
	}

  // Génerer un token
  const token: string = crypto.randomBytes(32).toString("hex");;
  const hashedToken: String = await hashToken(token);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  try {
    // Enregistre l'infomration dans la base
    const savedToken = await resetPasswordService.saveToken({
      user_id: user.id,
      token: hashedToken,
      expires_at: expiresAt
    });

    // Envoyer token via à l'utilisateur
    const email_subject = "Réinitialisation de votre mot de passe";
    const email_content = `
      <h3>Utiliser ce lien pour accéder à la page de réinitialisation de votre mot de passe</h3>
      <p>Cliquez
        <a href="https://traitement-admin/reset-password?token=${hashToken}"></a>
      </p>
    
    `;
    await sendEmail(user_email, email_subject, email_content);
    return res.status(201).json({ message: "Token generated and sent via email" });
  } catch (error) {
    return res.status(500).json({message: "Internal Server"})
  }


}