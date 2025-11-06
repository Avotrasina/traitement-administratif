import prisma from "../lib/prisma";
import { User } from "../types/user"; 
import { PrismaClientUnknownRequestError } from "../generated/prisma/internal/prismaNamespace";


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
		where: { role: "citoyen" },		
  });
  return users;

}

// Add new user in the db
export async function createUser(user : any) : Promise<User| null> {
  return await prisma.user.create({
		data: user,
		omit: {mot_de_passe: true},
	});
}

