import { LigneCommande } from './ligne-commande.model';
import { StatutCommande } from './statut-commande.enum';

export interface Commande {
  id?: number;
  clientId?: number;
  clientNom?: string;
  date?: string;
  statut: StatutCommande;
  montantTotal?: number;
  lignesCommande: LigneCommande[];
}