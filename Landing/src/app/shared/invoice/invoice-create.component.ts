import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InvoiceService } from '../services/invoice.service';

@Component({
  selector: 'app-invoice-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './invoice-create.component.html',
  styleUrls: ['./invoice-create.component.scss']
})
export class InvoiceCreateComponent {
  invoiceForm: FormGroup;
  loading = false;
  error = '';
  showInstallmentForm = false;
  installments: any[] = [];

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private router: Router
  ) {
    this.invoiceForm = this.fb.group({
      totalAmount: ['', [Validators.required, Validators.min(0)]],
      dueDate: ['', Validators.required],
      recipientEmail: ['', [Validators.required, Validators.email]],
      description: ['', Validators.required],
      isInstallment: [false]
    });
  }

  addInstallment(): void {
    this.installments.push({
      amount: '',
      dueDate: ''
    });
  }

  removeInstallment(index: number): void {
    this.installments.splice(index, 1);
  }

  calculateTotalInstallments(): number {
    return this.installments.reduce((sum, installment) => sum + (parseFloat(installment.amount) || 0), 0);
  }

  validateInstallments(): boolean {
    if (!this.invoiceForm.get('isInstallment')?.value) return true;
    
    const totalAmount = parseFloat(this.invoiceForm.get('totalAmount')?.value || '0');
    const installmentsTotal = this.calculateTotalInstallments();
    
    return Math.abs(totalAmount - installmentsTotal) < 0.01;
  }

  onSubmit(): void {
    if (this.invoiceForm.invalid || !this.validateInstallments()) {
      this.error = 'Please fill in all required fields correctly and ensure installment amounts match the total.';
      return;
    }

    this.loading = true;
    const invoiceData = {
      ...this.invoiceForm.value,
      installments: this.invoiceForm.get('isInstallment')?.value ? this.installments : []
    };

    this.invoiceService.createInvoice(invoiceData).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/invoices', response.id]);
      },
      error: (error) => {
        console.error('Error creating invoice:', error);
        this.error = 'Failed to create invoice. Please try again later.';
        this.loading = false;
      }
    });
  }
} 