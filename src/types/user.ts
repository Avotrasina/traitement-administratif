export interface User {
  id: number;
  nom: string;
  prenom?: string | null;
  email: string;
  mot_de_passe?: string | null;
  adresse?: string | null;
  telephone?: string | null;
  cin: string | null;
  role: string;
  date_inscription: Date | null;
}