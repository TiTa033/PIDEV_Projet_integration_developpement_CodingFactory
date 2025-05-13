// src/app/services/pfe.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Etat, PFE } from './pfe';
import { PlagiarismCheckResponse } from 'src/plagiarism-check-response.model'; // Import the interface

@Injectable({
  providedIn: 'root'
})
export class PfeService {
  private apiUrl = 'http://localhost:8086/pfe/api/pfe'; // Adjust port if needed

  constructor(private http: HttpClient) {}

  // Submit a new project
  soumettreProjet(pfe: PFE): Observable<PFE> {
    return this.http.post<PFE>(`${this.apiUrl}/soumettre`, pfe);
  }

  getProjetByEtudiant(etudiantId: number): Observable<PFE> {
    return this.http.get<PFE>(`${this.apiUrl}/projets/etudiant/${etudiantId}`);
  }

  getAllProjetsForTutor(tutorId: number): Observable<PFE[]> {
    return this.http.get<PFE[]>(`${this.apiUrl}/projets/tutor/${tutorId}`);
  }
  // Get all projects
  getAllProjets(): Observable<PFE[]> {
    return this.http.get<PFE[]>(`${this.apiUrl}/projets`);
  }

  // Get a project by ID
  getPFEById(id: number): Observable<PFE> {
    return this.http.get<PFE>(`${this.apiUrl}/projets/${id}`);
  }


// src/app/pfe.service.ts
evaluerProjet(projetId: number, etat: Etat): Observable<PFE> {
  return this.http.put<PFE>(`${this.apiUrl}/projets/${projetId}/evaluer?etat=${etat}`, {});
}
  // Delete a project
  supprimerProjet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/projets/${id}`);
  }

  // Upload a report for a project
  deposerRapport(id: number, file: File): Observable<PFE> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<PFE>(`${this.apiUrl}/projets/${id}/rapport`, formData);
  }

  // Download a report
  downloadRapport(id: number): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.apiUrl}/projets/${id}/rapport`, {
      responseType: 'blob',
      observe: 'response'
    });
  }

  // Check plagiarism for a file
  checkPlagiarism(file: File): Observable<PlagiarismCheckResponse> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<PlagiarismCheckResponse>(`${this.apiUrl}/check`, formData);
  }
}