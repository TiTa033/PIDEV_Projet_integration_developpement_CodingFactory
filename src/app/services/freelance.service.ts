import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Freelance {
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

  // Ajouter un freelance
  addFreelance(freelance: Freelance): Observable<Freelance> {
    return this.http.post<Freelance>(`${this.baseUrl}/AjoutFreelance`, freelance);
  }

  // Récupérer tous les freelances
  getFreelances(): Observable<Freelance[]> {
    return this.http.get<Freelance[]>(`${this.baseUrl}/AfficherFreelance`);
  }

  // Supprimer un freelance par ID
  deleteFreelance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/SupprimerFreelance/${id}`);
  }

  // Mettre à jour un freelance
  updateFreelance(freelance: Freelance): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/modifier-Freelance/${freelance.id}`, freelance);
  }



}
