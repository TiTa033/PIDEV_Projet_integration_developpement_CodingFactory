import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retryWhen, mergeMap, delayWhen } from 'rxjs/operators';
import { Evaluation } from 'src/app/models/evaluation';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private apiUrl = 'http://localhost:8089/PIDEV/evaluation';
  private retryDelay = 1000; // 1 seconde entre les retries
  private maxRetries = 3; // Nombre maximum de tentatives

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 0:
          errorMessage = 'Impossible de se connecter au serveur';
          break;
        case 400:
          errorMessage = 'Données invalides';
          break;
        case 401:
          errorMessage = 'Non autorisé';
          break;
        case 403:
          errorMessage = 'Accès refusé';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée';
          break;
        case 409:
          errorMessage = 'Conflit de données';
          break;
        case 500:
          errorMessage = 'Erreur interne du serveur';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.message}`;
      }
      
      // Ajouter le message d'erreur du serveur si disponible
      if (error.error && error.error.message) {
        errorMessage += ` - Détails: ${error.error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Authorization': 'Bearer ' + token // Si vous utilisez JWT
    });
  }

  private shouldRetry(error: HttpErrorResponse): boolean {
    // Ne pas retenter pour ces codes d'erreur
    const noRetryCodes = [400, 401, 403, 404];
    return !noRetryCodes.includes(error.status);
  }

  private retryRequest<T>() {
    return (source: Observable<T>) =>
      source.pipe(
        retryWhen(errors =>
          errors.pipe(
            mergeMap((error, i) => {
              const retryAttempt = i + 1;
              
              if (retryAttempt > this.maxRetries || !this.shouldRetry(error)) {
                return throwError(() => error);
              }
              
              console.log(`Tentative ${retryAttempt} - réessai dans ${this.retryDelay}ms`);
              return timer(this.retryDelay);
            })
          )
        )
      );
  }

  getAllEvaluations(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.apiUrl}/retrieve-all-evaluations`, {
      headers: this.getHeaders()
    }).pipe(
      this.retryRequest(),
      catchError(this.handleError)
    );
  }

  getEvaluationById(id: number): Observable<Evaluation> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID invalide'));
    }
    
    return this.http.get<Evaluation>(`${this.apiUrl}/retrieve-evaluation/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  addEvaluation(evaluation: Evaluation): Observable<Evaluation> {
    if (!evaluation) {
      return throwError(() => new Error('Données manquantes'));
    }
    
    if (evaluation.note !== null && evaluation.note !== undefined) {
      if (new Date(evaluation.dateEvaluation) > new Date()) {
        return throwError(() => new Error("Une évaluation future ne peut pas avoir de note"));
      }
      
      if (evaluation.note < 0 || evaluation.note > 20) {
        return throwError(() => new Error("La note doit être entre 0 et 20"));
      }
    }
    
    return this.http.post<Evaluation>(`${this.apiUrl}/add-evaluation`, evaluation, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateEvaluation(evaluation: Evaluation): Observable<Evaluation> {
    if (!evaluation || !evaluation.idEvaluation) {
      return throwError(() => new Error('Données manquantes'));
    }
    
    if (evaluation.note !== null && evaluation.note !== undefined) {
      if (new Date(evaluation.dateEvaluation) > new Date()) {
        return throwError(() => new Error("Une évaluation future ne peut pas avoir de note"));
      }
      
      if (evaluation.note < 0 || evaluation.note > 20) {
        return throwError(() => new Error("La note doit être entre 0 et 20"));
      }
    }
    
    return this.http.put<Evaluation>(`${this.apiUrl}/modify-evaluation`, evaluation, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteEvaluation(id: number): Observable<void> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID invalide'));
    }
    
    return this.http.delete<void>(`${this.apiUrl}/remove-evaluation/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  getUpcomingEvaluations(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.apiUrl}/upcoming-evaluations`, {
      headers: this.getHeaders()
    }).pipe(
      this.retryRequest(),
      catchError(this.handleError)
    );
  }

  getCompletedEvaluations(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.apiUrl}/completed-evaluations`, {
      headers: this.getHeaders()
    }).pipe(
      this.retryRequest(),
      catchError(this.handleError)
    );
  }

  checkEvaluationExists(sujet: string, date: Date): Observable<boolean> {
    if (!sujet || !date) {
      return throwError(() => new Error('Paramètres manquants'));
    }
    
    return this.http.get<boolean>(`${this.apiUrl}/exists?sujet=${encodeURIComponent(sujet)}&date=${date.toISOString()}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }
}