import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';

// project import
import { SharedModule } from 'src/app/back-office/demo/shared/shared.module';
import { PaymentService, Payment } from 'src/app/shared/services/payment.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
  // Table properties
  displayedColumns: string[] = ['id', 'amount', 'method', 'status', 'paymentDate', 'dueDate', 'actions'];
  dataSource = new MatTableDataSource<Payment>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Filter properties
  selectedStatus = '';
  selectedMethod = '';
  dateRange = this.fb.group({
    start: [null],
    end: [null]
  });

  // Statistics properties
  totalOutstanding = 12121535335.00;
  totalPaid = 123123.00;
  pendingCount = 5;
  failedCount = 1;
  pendingAmount = 12121535335.00;
  failedAmount = 29999.00;
  outstandingPercentage = 15;
  paidPercentage = 25;
  fraudResult: string | null = null;


  // Loading states
  loading = false;
  error: string | null = null;

  payments: Payment[] = [];

  constructor(private paymentService: PaymentService, private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadPayments();
    this.loadStatistics();

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadPayments() {
    this.loading = true;
    this.paymentService.getPayments().subscribe({
      next: (payments) => {
        this.dataSource.data = payments;
        this.payments = payments;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.error = 'Failed to load payments';
        this.loading = false;
      }
    });
  }

  loadStatistics() {
    this.paymentService.getPayments().subscribe((payments) => {
      // Calculate totals
      this.totalOutstanding = payments
        .filter(p => p.status === 'PENDING')
        .reduce((sum, p) => sum + p.amount, 0);

      this.totalPaid = payments
        .filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + p.amount, 0);

      this.pendingCount = payments.filter(p => p.status === 'PENDING').length;
      this.failedCount = payments.filter(p => p.status === 'FAILED').length;

      this.pendingAmount = payments
        .filter(p => p.status === 'PENDING')
        .reduce((sum, p) => sum + p.amount, 0);

      this.failedAmount = payments
        .filter(p => p.status === 'FAILED')
        .reduce((sum, p) => sum + p.amount, 0);

      // Calculate percentages (mock values for now)
      this.outstandingPercentage = 15;
      this.paidPercentage = 25;
    });
  }

  applyFilters() {
    this.loading = true;
    // Filter logic implementation
    setTimeout(() => {
      if (this.selectedStatus || this.selectedMethod || this.dateRange.value.start || this.dateRange.value.end) {
        let filteredData = [...this.payments];

        if (this.selectedStatus) {
          filteredData = filteredData.filter(payment => payment.status === this.selectedStatus);
        }

        if (this.selectedMethod) {
          filteredData = filteredData.filter(payment => payment.method === this.selectedMethod);
        }

        // Add date range filtering when implemented

        this.dataSource.data = filteredData;
      } else {
        this.dataSource.data = this.payments;
      }
      this.loading = false;
    }, 500);
  }

  getMethodIcon(method: string): string {
    switch (method) {
      case 'CARD': return 'credit_card';
      case 'BANK': return 'account_balance';
      case 'CASH': return 'payments';
      default: return 'payment';
    }
  }

  createNewPayment() {
    // TODO: Implement new payment creation
    console.log('Creating new payment');
  }

  viewPayment(payment: Payment) {
    console.log('Viewing payment:', payment);
  }

  editPayment(payment: Payment) {
    console.log('Editing payment:', payment);
  }

  deletePayment(payment: Payment) {
    console.log('Deleting payment:', payment);
  }

  fraudResults: { index: number; score: number; isFraud: boolean; message: string }[] = [];

  predictFraud() {
    this.loading = true;
    this.paymentService.predictFraud().subscribe({
      next: (rawResult) => {
        this.loading = false;
        try {
          const result = JSON.parse(rawResult);
          const scores: number[] = result.prediction;

          this.fraudResults = scores.map((score: number, index: number) => {
            const isFraud = score >= 0.5;
            return {
              index: index + 1,
              score,
              isFraud,
              message: isFraud
                ? `❌ Invoice #${index + 1} appears to be fraudulent (Score: ${score.toFixed(2)}). Please review it carefully.`
                : `✅ Invoice #${index + 1} is clean (Score: ${score.toFixed(2)}). No signs of fraud detected.`
            };
          });
        } catch (e) {
          console.error('Invalid fraud prediction result:', rawResult);
          this.fraudResults = [{
            index: 0,
            score: 0,
            isFraud: true,
            message: 'Failed to parse fraud prediction result.'
          }];
        }
      },
      error: (err) => {
        this.loading = false;
        this.fraudResults = [{
          index: 0,
          score: 0,
          isFraud: true,
          message: 'Fraud prediction failed: ' + err.message
        }];
        console.error('Fraud prediction failed:', err);
      }
    });
  }


}
