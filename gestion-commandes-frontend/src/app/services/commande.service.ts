import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commande } from '../models/commande.model';
import { LigneCommande } from '../models/ligne-commande.model';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = 'http://localhost:8081/api/commandes';

  constructor(private http: HttpClient) { }

  getAllCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(this.apiUrl);
  }

  getCommandeById(id: number): Observable<Commande> {
    return this.http.get<Commande>(`${this.apiUrl}/${id}`);
  }

  createCommande(clientId: number, lignes: LigneCommande[]): Observable<Commande> {
    return this.http.post<Commande>(`${this.apiUrl}/client/${clientId}`, lignes);
  }

  // ✅ AJOUTE CECI
  updateCommande(id: number, commande: Commande): Observable<Commande> {
    return this.http.put<Commande>(`${this.apiUrl}/${id}`, commande);
  }

  // ✅ AJOUTE CECI
  deleteCommande(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  validerCommande(id: number): Observable<Commande> {
    return this.http.put<Commande>(`${this.apiUrl}/${id}/valider`, {});
  }

  getHistoriqueClient(clientId: number): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/client/${clientId}/historique`);
  }
}