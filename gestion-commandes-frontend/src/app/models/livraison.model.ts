import { StatutLivraison } from "./statut-livraison.enum";

export interface Livraison {
  id?: number;
  commandeId?: number;
  transporteurId?: number;
  transporteurNom?: string;
  dateLivraison?: string;
  cout?: number;
  statut: StatutLivraison;
}