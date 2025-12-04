// src/services/emailService.ts
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST, 
	port: Number(process.env.SMTP_PORT) || 587,
	secure: true, 
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

export const sendEmail = async (to: string, subject: string, html: string) => {
	try {
		const info = await transporter.sendMail({
			from: `"Admin" <${process.env.SMTP_USER}>`,
			to,
			subject,
			html,
		});
		console.log("Email sent: ", info.messageId);
	} catch (error) {
		console.error("Error sending email:", error);
		throw error;
	}
};
