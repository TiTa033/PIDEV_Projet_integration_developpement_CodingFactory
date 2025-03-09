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

  getQrCode(certificationId: number): Observable<string> {
    return this.http.get(`http://localhost:8089/PIDEV/certification/generate-qrcode/${certificationId}`, { responseType: 'text' });
  }

  downloadCertification(id: number): void {
    const url = `${this.apiUrl}/download-certification/${id}`;
    this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = `certification_${id}.pdf`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }  
  
  verifyCertification(qrCodeBase64: string): Observable<string> {
    const url = `${this.apiUrl}/validate-certification?qrCode=${qrCodeBase64}`;
    return this.http.get<string>(url);
  }
}