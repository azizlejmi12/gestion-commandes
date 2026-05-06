import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Livraison } from '../models/livraison.model';

@Injectable({
  providedIn: 'root'
})
export class LivraisonService {
  private apiUrl = 'http://localhost:8081/api/livraisons';

  constructor(private http: HttpClient) { }

  getAllLivraisons(): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(this.apiUrl);
  }

  getLivraisonById(id: number): Observable<Livraison> {
    return this.http.get<Livraison>(`${this.apiUrl}/${id}`);
  }

  createLivraison(commandeId: number, transporteurId: number | null, cout: number): Observable<Livraison> {
    let url = `${this.apiUrl}/commande/${commandeId}?cout=${cout}`;
    if (transporteurId) {
      url += `&transporteurId=${transporteurId}`;
    }
    return this.http.post<Livraison>(url, {});
  }

  expedier(id: number): Observable<Livraison> {
    return this.http.put<Livraison>(`${this.apiUrl}/${id}/expedier`, {});
  }

  livrer(id: number): Observable<Livraison> {
    return this.http.put<Livraison>(`${this.apiUrl}/${id}/livrer`, {});
  }

  getLivraisonByCommande(commandeId: number): Observable<Livraison> {
    return this.http.get<Livraison>(`${this.apiUrl}/commande/${commandeId}`);
  }
}