import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Stage } from './stage';

@Injectable({
  providedIn: 'root'
})
export class StageService {
  getAllStages() {
    throw new Error('Method not implemented.');
  }
  private baseURL = "http://localhost:8089/stages/api/stages";
  constructor(private httpClient: HttpClient) { }
  getStagesList(): Observable<Stage[]>{
    return this.httpClient.get<Stage[]>(`${this.baseURL}`);
  }
  CreateStage(stage: Stage): Observable<Stage> {
    return this.httpClient.post<Stage>(`${this.baseURL}/add-stage`, stage);
  }
  
  //updateStage(id: number, stage: Stage): Observable<Object> {
 ///   return this.httpClient.put(`http://localhost:8089/stages/api/update-stage/${id}`, stage);
 // }
 getStageById(id: string): Observable<any> {
  return this.httpClient.get<any>(`${this.baseURL}/${id}`);
}
deleteStage(id: number): Observable<Object> {
  return this.httpClient.delete(`${this.baseURL}/${id}`);
}

// Méthode pour mettre à jour un stage (si vous avez un formulaire de mise à jour)
updateStage(stage: Stage): Observable<Stage> {
  return this.httpClient.put<Stage>(`${this.baseURL}/modifier-stage`, stage);
}

}
