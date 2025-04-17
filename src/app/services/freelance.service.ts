import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Freelance {
  id: number;
  nom: string;
  email: string;
  tarifHoraire: number;
}

@Injectable({
  providedIn: 'root',
})
export class FreelanceService {
  private baseUrl = 'http://localhost:8087/Freelance1/Freelance';

  constructor(private http: HttpClient) {}

  addFreelance(f: Freelance): Observable<Freelance> {
    return this.http.post<Freelance>(`${this.baseUrl}/AjoutFreelance`, f);
  }

  getFreelances(): Observable<Freelance[]> {
    return this.http.get<Freelance[]>(`${this.baseUrl}/AfficherFreelance`);
  }

  deleteFreelance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/SupprimerFreelance/${id}`);
  }

  updateFreelance(f: Freelance): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/modifier-Freelance`, f);
  }

  getFreelancesByTarif(min: number, max: number): Observable<Freelance[]> {
    return this.http.get<Freelance[]>(`${this.baseUrl}/freelances/tarif/${min}/${max}`);
  }

  getFreelancesSortedByTarif(order: string): Observable<Freelance[]> {
    return this.http.get<Freelance[]>(`${this.baseUrl}/freelances/sorted-by-tarif/${order}`);
  }
}
