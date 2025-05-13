import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Stage } from './stage';


@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private apiUrl = `${environment.apiBaseUrl}/api/stages/recommend`;

  constructor(private http: HttpClient) { }

  getRecommendedStages(etudiantId: number): Observable<Stage[]> {
    return this.http.get<Stage[]>(`${this.apiUrl}/${etudiantId}`);
  }
}
