import { Request, Response } from "express";
import * as userService from './../sevices/userService.js';
import * as bcrypt from "../utils/bcrypt.js";
export async function hello(req: Request, res: Response) {
  res.send('Hello world !');
}


export async function getById(req: Request, res: Response) {
  const user_id: number = Number(req.params.id);
  console.log(user_id);
  try {
    const user = await userService.getUserById(user_id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json(user);
  } catch (error) {
    return res
			.status(500)
			.json({ message: `Internal Server Error : ${error}` });
  }

}

// List of users based on their role
export async function showUsers(req: Request, res: Response) {
  try {
    const users = await userService.showUsers();
    console.log(users);
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lié au serveur' });
  }
}

// Create a new user
export async function createUser(req: Request, res: Response) {
  const { role } = req.body;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (role === 'admin' || role === 'agent') {
    // validation part
    const { nom, prenom, email, mot_de_passe } = req.body;
    
    if (!nom || !email || !mot_de_passe) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // email validation 
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }    
    try {
      const user = {
        nom,
        prenom,
        email,
        mot_de_passe: await bcrypt.hashPassword(mot_de_passe)
      };
      const new_user = await userService.createUser(user);
      return res.status(201).json(new_user);
    } catch (error) {
      return res.status(500).json({ message: `Internal Server Error : ${error}` });
    }
  }

  // Citoyen
  else if (role === 'citoyen') {
		const { nom, prenom, email, mot_de_passe, adresse, telephone, cin } = req.body;

    if (!nom || !email || !mot_de_passe || !cin || !telephone) {
			return res.status(400).json({ message: "All fields are required" });
    }
    
		// Validate email
		if (!emailRegex.test(email)) {
			return res.status(400).json({ message: "Invalid email" });
		}

		try {
			const user = {
				nom,
				prenom,
        email,
        adresse,
        telephone,
        cin,
        role,
				mot_de_passe: await bcrypt.hashPassword(mot_de_passe),
			};
			const new_user = await userService.createUser(user);
			return res.status(201).json(new_user);
		} catch (error) {
			return res
				.status(500)
				.json({ message: `Internal Server Error : ${error}` });
		}
	}

}

// Update user
export async function updateUser(req: Request, res: Response) {
  // Check if user doesn't exist
  const user_id: number = Number(req.params.id);
	const user = await userService.getUserById(user_id);
  if (!user) return res.status(404).json({ message: "User not found" });
  
  const { role } = req.body;
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	if (role === "admin" || role === "agent") {
		// validation part
		const { nom, prenom, email, mot_de_passe } = req.body;

		if (!nom || !email || !mot_de_passe) {
			return res.status(400).json({ message: "All fields are required" });
		}
		// email validation
		if (!emailRegex.test(email)) {
			return res.status(400).json({ message: "Invalid email" });
		}
		try {
      const user = {
        id: user_id,
				nom,
				prenom,
				email,
				mot_de_passe: await bcrypt.hashPassword(mot_de_passe),
			};
			const udpated_user = await userService.updateUser(user);
			return res.status(200).json(udpated_user);
		} catch (error) {
			return res
				.status(500)
				.json({ message: `Internal Server Error : ${error}` });
		}
	}

	// Citoyen
	else if (role === "citoyen") {
		const { nom, prenom, email, mot_de_passe, adresse, telephone, cin } =
			req.body;

		if (!nom || !email || !mot_de_passe || !cin || !telephone) {
			return res.status(400).json({ message: "All fields are required" });
		}

		// Validate email
		if (!emailRegex.test(email)) {
			return res.status(400).json({ message: "Invalid email" });
		}

		try {
      const user = {
        id: user_id,
				nom,
				prenom,
				email,
				adresse,
				telephone,
				cin,
				role,
				mot_de_passe: await bcrypt.hashPassword(mot_de_passe),
			};
			const udpated_user = await userService.updateUser(user);
			return res.status(200).json(udpated_user);
		} catch (error) {
			return res
				.status(500)
				.json({ message: `Internal Server Error : ${error}` });
		}
	}

}

// Delete an existing user
export async function deleteUser(req: Request, res: Response) {
  const user_id : number = Number(req.params.id);
  const user = await userService.getUserById(user_id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  try {
    const deleted_user = await userService.deleteUser(user_id);
    return res.status(200).json(deleteUser);
  } catch (error) {
    return res.status(500).json({ message: `Internal Serveur Error: ${error}` });
  }


  console.log(user_id);
  return res.status(200);
}


// Update an existing user
export async function udpateUser(req: Request, res: Response) {

}



