import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Livraison } from '../models/livraison.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LivraisonService {
  private apiUrl = environment.apiUrl + '/api/livraisons';

  constructor(private http: HttpClient) { }

  getAllLivraisons(): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(this.apiUrl);
  }

  getLivraisonById(id: number): Observable<Livraison> {
    return this.http.get<Livraison>(`${this.apiUrl}/${id}`);
  }

  createLivraison(commandeId: number, transporteurId: number | null, cout: number): Observable<Livraison> {
    let url = `${this.apiUrl}/commande/${commandeId}?cout=${cout}`;
    if (transporteurId !== null && transporteurId !== undefined) {
      url += `&transporteurId=${transporteurId}`;
    }
    return this.http.post<Livraison>(url, {});
  }

  expedier(id: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}/expedier`, {}, { responseType: 'text' });
  }

  livrer(id: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}/livrer`, {}, { responseType: 'text' });
  }

  getLivraisonByCommande(commandeId: number): Observable<Livraison> {
    return this.http.get<Livraison>(`${this.apiUrl}/commande/${commandeId}`);
  }
}