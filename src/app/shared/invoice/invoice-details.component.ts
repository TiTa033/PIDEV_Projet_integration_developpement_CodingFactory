import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService, Invoice, Installment } from '../services/invoice.service';
import { PdfService } from '../services/pdf.service';
import { EmailService } from '../services/email.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-invoice-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss']
})
export class InvoiceDetailsComponent implements OnInit {
  invoice: Invoice | null = null;
  loading = true;
  error = '';
  showEmailModal = false;
  emailForm = {
    subject: '',
    message: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService,
    private pdfService: PdfService,
    private emailService: EmailService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !isNaN(Number(id))) {
      this.loadInvoice(Number(id));
    } else {
      this.error = 'Invalid invoice ID';
      this.loading = false;
      setTimeout(() => this.router.navigate(['/invoices']), 2000);
    }
  }

  loadInvoice(id: number): void {
    this.loading = true;
    this.invoiceService.getInvoice(id).pipe(
      catchError(error => {
        console.error('Error loading invoice:', error);
        this.error = 'Failed to load invoice. Please try again later.';
        this.loading = false;
        return of(null);
      })
    ).subscribe(invoice => {
      this.invoice = invoice;
      this.loading = false;
      if (!invoice) {
        this.error = 'Invoice not found';
        setTimeout(() => this.router.navigate(['/invoices']), 2000);
      }
    });
  }

  async markAsPaid(): Promise<void> {
    if (!this.invoice) return;

    try {
      const updatedInvoice = await this.invoiceService.updateInvoice(this.invoice.id, {
        ...this.invoice,
        isPaid: true
      }).toPromise();

      if (updatedInvoice) {
        this.invoice = updatedInvoice;
        // Send payment confirmation email
        await this.emailService.sendInvoicePaid(updatedInvoice);
      }
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      this.error = 'Failed to update invoice status';
    }
  }

  async sendReminder(): Promise<void> {
    if (!this.invoice) return;

    try {
      await this.emailService.sendInvoiceReminder(this.invoice);
    } catch (error) {
      console.error('Error sending reminder:', error);
      this.error = 'Failed to send reminder email';
    }
  }

  async sendCustomEmail(): Promise<void> {
    if (!this.invoice) return;

    try {
      const options = {
        to: this.invoice.recipientEmail,
        subject: this.emailForm.subject,
        body: this.emailForm.message
      };

      await this.emailService.sendEmail(options);
      this.showEmailModal = false;
      this.emailForm = { subject: '', message: '' };
    } catch (error) {
      console.error('Error sending custom email:', error);
      this.error = 'Failed to send email';
    }
  }

  async downloadPdf(): Promise<void> {
    if (!this.invoice) return;

    try {
      const pdfBlob = await this.pdfService.generateInvoicePdf(this.invoice);
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${this.invoice.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      this.error = 'Failed to generate PDF';
    }
  }

  getInstallmentStatusClass(isPaid: boolean): string {
    return isPaid ? 'badge bg-success' : 'badge bg-warning';
  }

  getInvoiceStatusClass(isPaid: boolean): string {
    return isPaid ? 'badge bg-success' : 'badge bg-warning';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  calculateTotalPaidAmount(): number {
    if (!this.invoice) return 0;
    return this.invoice.installments
      .filter(installment => installment.isPaid)
      .reduce((sum, installment) => sum + installment.amount, 0);
  }

  calculateRemainingAmount(): number {
    if (!this.invoice) return 0;
    return this.invoice.totalAmount - this.calculateTotalPaidAmount();
  }

  getPaymentProgress(): number {
    if (!this.invoice) return 0;
    return (this.calculateTotalPaidAmount() / this.invoice.totalAmount) * 100;
  }
} 