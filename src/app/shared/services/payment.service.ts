import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';

// Define Payment, Invoice, and other interfaces as needed
export interface Payment {
  id?: number;
  amount: number;
  method: 'CARD' | 'BANK' | 'CASH';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  paymentDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  invoice?: { id: number };
  createdAt?: string;
  updatedAt?: string;
  recurrence?: {
    type: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate: string;
  };
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private baseUrl = environment.apiUrl + '/api/payments'; // e.g., http://localhost:8080/api/api/payments

  constructor(private http: HttpClient) {}

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/all`).pipe(
      catchError(error => {
        console.error('Error fetching payments:', error);
        return of([]);
      })
    );
  }

  getPayment(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.baseUrl}/${id}`);
  }

  createPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(`${this.baseUrl}`, payment);
  }

  updatePayment(id: number, payment: Payment): Observable<Payment> {
    return this.http.put<Payment>(`${this.baseUrl}/${id}`, payment);
  }

  deletePayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  predictFraud(): Observable<string> {
    return this.http.get('http://localhost:8086/api/api/payments/fraud', { responseType: 'text' });
  }


  // Add more methods for invoices, reports, etc. as needed
}
