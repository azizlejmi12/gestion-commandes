import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paiement } from '../models/paiement.model';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {
  private apiUrl = 'http://localhost:8081/api/paiements';

  constructor(private http: HttpClient) { }

  createPaiement(commandeId: number, mode: string): Observable<Paiement> {
    return this.http.post<Paiement>(`${this.apiUrl}/commande/${commandeId}?mode=${mode}`, {});
  }

  traiterPaiement(id: number): Observable<Paiement> {
    return this.http.post<Paiement>(`${this.apiUrl}/${id}/traiter`, {});
  }

  rembourser(id: number): Observable<Paiement> {
    return this.http.post<Paiement>(`${this.apiUrl}/${id}/rembourser`, {});
  }

  getPaiementById(id: number): Observable<Paiement> {
    return this.http.get<Paiement>(`${this.apiUrl}/${id}`);
  }

  getPaiementByCommande(commandeId: number): Observable<Paiement> {
    return this.http.get<Paiement>(`${this.apiUrl}/commande/${commandeId}`);
  }

  getAllPaiements(): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(this.apiUrl);
  }
}