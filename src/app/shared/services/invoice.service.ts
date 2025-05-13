import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';

export interface Invoice {
  id: number;
  totalAmount: number;
  dueDate: string;
  isPaid: boolean;
  recipientEmail: string;
  installments: Installment[];
  createdAt: string;
  updatedAt: string;
  description?: string;
}

export interface Installment {
  id: number;
  amount: number;
  dueDate: string;
  isPaid: boolean;
}

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private baseUrl = environment.apiUrl + '/api/payments/invoices';

  constructor(private http: HttpClient) {}

  getInvoice(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.baseUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching invoice:', error);
        throw error;
      })
    );
  }

  createInvoice(invoice: Partial<Invoice>): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.baseUrl}`, invoice).pipe(
      catchError(error => {
        console.error('Error creating invoice:', error);
        throw error;
      })
    );
  }

  updateInvoice(id: number, invoice: Partial<Invoice>): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.baseUrl}/${id}`, invoice).pipe(
      catchError(error => {
        console.error('Error updating invoice:', error);
        throw error;
      })
    );
  }

  deleteInvoice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting invoice:', error);
        throw error;
      })
    );
  }

  downloadInvoicePdf(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/pdf`, { responseType: 'blob' }).pipe(
      catchError(error => {
        console.error('Error downloading invoice PDF:', error);
        throw error;
      })
    );
  }

  sendInvoiceByEmail(id: number, email: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/send`, null, {
      params: { email }
    }).pipe(
      catchError(error => {
        console.error('Error sending invoice by email:', error);
        throw error;
      })
    );
  }
} 