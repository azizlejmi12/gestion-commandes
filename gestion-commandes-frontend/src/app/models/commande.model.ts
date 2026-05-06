import { Client } from './client.model';
import { LigneCommande } from './ligne-commande.model';
import { StatutCommande } from './statut-commande.enum';

export interface Commande {
  id?: number;
  client: Client;
  date?: string;
  statut: StatutCommande;
  montantTotal?: number;
  lignesCommande: LigneCommande[];
}