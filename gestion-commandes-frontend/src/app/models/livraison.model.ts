import { StatutLivraison } from './statut-livraison.enum';
import { Commande } from './commande.model';
import { Transporteur } from './transporteur.model';

export interface Livraison {
  id?: number;
  commande?: Partial<Commande>;
  transporteur?: Transporteur;
  dateLivraison?: string;
  cout?: number;
  statut: StatutLivraison;
}