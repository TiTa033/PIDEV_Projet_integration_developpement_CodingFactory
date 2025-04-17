import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PublicationService {
  private baseUrl = 'http://localhost:8087/Freelance1/Publication';

  constructor(private http: HttpClient) {}

  addPublication(publication: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/AjoutPub`, publication);
  }

  getPublications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/AfficherPub`);
  }

  deletePublication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/SupprimerPub/${id}`);
  }

  updatePublication(publication: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/modifier-Pub`, publication);
  }

  addLike(pubId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/like/${pubId}`, {});
  }

  addDislike(pubId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/dislike/${pubId}`, {});
  }

  addComment(pubId: number, comment: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/commentaire/${pubId}`, { texte: comment });
  }
  getMostPopularPublications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/populaires`);
  }
  downloadPublicationsPdf(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download-pdf`, { responseType: 'blob' });
  }
  
}
