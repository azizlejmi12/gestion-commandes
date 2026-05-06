import { StatutPaiement } from './statut-paiement.enum';

export interface Paiement {
  id?: number;
  commande?: { id?: number; montantTotal?: number };  // ✅ AJOUTE CECI
  date?: string;
  statut: StatutPaiement;
  mode: string;
}