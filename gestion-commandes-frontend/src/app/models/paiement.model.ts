import { StatutPaiement } from "./statut-paiement.enum";

export interface Paiement {
  id?: number;
  commandeId?: number;
  date?: string;
  statut: StatutPaiement;
  mode: string;
}