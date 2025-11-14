import prisma from "../lib/prisma.js";
import { User } from "../types/user.js";
import { PrismaClientUnknownRequestError } from "../generated/prisma/internal/prismaNamespace";

// Get user by email
export async function getUserByEmail(email: string) {
	const user = await prisma.user.findUnique({
		select: {
			id: true,
			nom: true,
			prenom: true,
			email: true,
			mot_de_passe: true,
			role: true,
			adresse: true,
			cin: true,
			telephone: true,
			date_inscription: true,
		},
		where: { email: email },
	});
	return user;
}

// Get user by id
export async function getUserById(user_id: number): Promise<User | null> {
	const user = await prisma.user.findUnique({
		select: {
			id: true,
			nom: true,
			prenom: true,
			email: true,
			role: true,
			adresse: true,
			cin: true,
			telephone: true,
			date_inscription: true,
		},
		where: {
			id: user_id,
		},
	});

	if (!user) return null;

	// Dynamically omit unnecessary fields
	if (user.role !== "citoyen") {
		delete (user as any).adresse;
		delete (user as any).telephone;
		delete (user as any).cin;
		delete (user as any).mot_de_passe;
	}

	return user;
}

// Show all users
export async function showUsers(): Promise<User[] | null> {
	const users = await prisma.user.findMany({
		select: {
			id: true,
			nom: true,
			prenom: true,
			email: true,
			role: true,
			adresse: true,
			cin: true,
			telephone: true,
			date_inscription: true,
		},
	});
	return users;
}

// Add new user in the db
export async function createUser(user: any): Promise<User | null> {
	return await prisma.user.create({
		data: user,
		omit: { mot_de_passe: true },
	});
}

export async function deleteUser(user_id: number): Promise<User | null> {
	return await prisma.user.delete({
		where: { id: user_id },
	});
}

export async function updateUser(user: any): Promise<User | null> {
	return await prisma.user.update({
		data: user,
		omit: { mot_de_passe: true },
		where: { id: user.id },
	});
}
