import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PublicationService {
  private baseUrl = 'http://localhost:8088/Forum/Publication'; // Adjust if needed

  constructor(private http: HttpClient) {}

  // ✅ Add a new publication
  addPublication(publication: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/AjoutPub`, publication);
  }

  // ✅ Retrieve all publications
  getPublications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/AfficherPub`);
  }

  // ✅ Delete a publication by ID
  deletePublication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/SupprimerPub/${id}`);
  }

  // ✅ Update an existing publication
  updatePublication(publication: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/modifier-Pub`, publication);
  }
}
