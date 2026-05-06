import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transporteur } from '../models/transporteur.model';

@Injectable({
  providedIn: 'root'
})
export class TransporteurService {
  private apiUrl = 'http://localhost:8081/api/transporteurs';

  constructor(private http: HttpClient) { }

  getAllTransporteurs(): Observable<Transporteur[]> {
    return this.http.get<Transporteur[]>(this.apiUrl);
  }

  getTransporteurById(id: number): Observable<Transporteur> {
    return this.http.get<Transporteur>(`${this.apiUrl}/${id}`);
  }

  createTransporteur(transporteur: Transporteur): Observable<Transporteur> {
    return this.http.post<Transporteur>(this.apiUrl, transporteur);
  }
  updateTransporteur(id: number, transporteur: Transporteur): Observable<Transporteur> {
    return this.http.put<Transporteur>(`${this.apiUrl}/${id}`, transporteur);
  }
  deleteTransporteur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}