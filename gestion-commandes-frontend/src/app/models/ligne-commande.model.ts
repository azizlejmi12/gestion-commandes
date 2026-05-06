export interface LigneCommande {
  id?: number;
  produit: string;
  quantite: number;
  prixUnitaire: number;
  sousTotal?: number;
}