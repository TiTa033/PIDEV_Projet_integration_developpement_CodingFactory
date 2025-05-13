import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttestationService {
  private apiUrl = 'http://localhost:8089/stages/api/attestations';

  constructor(private http: HttpClient) {}

  downloadAttestation(stageId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${stageId}/download`, { responseType: 'blob' });
  }
  
}
