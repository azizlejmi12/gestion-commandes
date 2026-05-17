import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commande } from '../models/commande.model';
import { LigneCommande } from '../models/ligne-commande.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = environment.apiUrl + '/api/commandes';

  constructor(private http: HttpClient) { }

  getAllCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(this.apiUrl);
  }

  getCommandeById(id: number): Observable<Commande> {
    return this.http.get<Commande>(`${this.apiUrl}/${id}`);
  }

  createCommande(clientId: number, lignes: LigneCommande[]): Observable<string> {
    return this.http.post(`${this.apiUrl}/client/${clientId}`, lignes, { responseType: 'text' });
  }

  updateCommande(id: number, commande: Commande): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, commande, { responseType: 'text' });
  }

  deleteCommande(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  validerCommande(id: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}/valider`, {}, { responseType: 'text' });
  }

  getHistoriqueClient(clientId: number): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/client/${clientId}/historique`);
  }
}