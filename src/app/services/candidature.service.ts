import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {SubmissionStat} from "../submission-stats.model";

export interface Candidature {
  id?: number;
  nom: string;
  email: string;
  dateDeNaissance: string; // Format: YYYY-MM-DD
  cvUrl: string;
  specialite: 'Développement' | 'DevVR' | 'JeuxVidéo';
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  dateSoumission?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CandidatureService {
  private apiUrl = 'http://localhost:8088/api/candidatures';

  constructor(private http: HttpClient) {}
  submitCandidature(formData: FormData): Observable<Candidature> {
    return this.http.post<Candidature>(`${this.apiUrl}/upload`, formData);
  }

  // Get all candidatures
  getAllCandidatures(): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(`${this.apiUrl}/all`);
  }

  // Delete a candidature
  deleteCandidature(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Update candidature status
  updateStatus(id: number, status: 'PENDING' | 'ACCEPTED' | 'REJECTED'): Observable<Candidature> {
    return this.http.put<Candidature>(`${this.apiUrl}/${id}/status?status=${status}`, {});
  }

  // Get details of a single candidature
  getCandidatureById(id: number): Observable<Candidature> {
    return this.http.get<Candidature>(`${this.apiUrl}/${id}`);
  }
  getStatByStatus(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/statistics/status`);
  }
  downloadCv(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download-cv`, {
      responseType: 'blob'
    });
  }
  getWeeklySubmissionStats(): Observable<SubmissionStat[]> {
    return this.http.get<SubmissionStat[]>(`${this.apiUrl}/stats/weekly-submissions`);
  }
}
