import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Certification } from 'src/app/models/certification';

@Injectable({
  providedIn: 'root'
})
export class CertificationService {
  private apiUrl = 'http://localhost:8089/PIDEV/certification';

  constructor(private http: HttpClient) {}

  getCertifications(): Observable<Certification[]> {
    return this.http.get<Certification[]>(`${this.apiUrl}/retrieve-all-certifications`);
  }

  getCertificationById(id: number): Observable<Certification> {
    return this.http.get<Certification>(`${this.apiUrl}/retrieve-certification/${id}`);
  }

  addCertification(certification: Certification): Observable<Certification> {
    return this.http.post<Certification>(`${this.apiUrl}/add-certification`, certification);
  }

  updateCertification(certification: Certification): Observable<Certification> {
    return this.http.put<Certification>(`${this.apiUrl}/modify-certification`, certification);
  }

  deleteCertification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-certification/${id}`);
  }
}
