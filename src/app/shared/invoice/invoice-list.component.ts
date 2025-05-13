import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InvoiceService, Invoice } from '../services/invoice.service';
import { PdfService } from '../services/pdf.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  loading = true;
  error = '';
  
  // Filter and search properties
  searchTerm = '';
  statusFilter = 'ALL';
  dateFilter = 'ALL';
  sortBy = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';
  
  // Pagination properties
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  // Statistics
  statistics = {
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
    totalAmount: 0,
    averageAmount: 0
  };

  constructor(
    private invoiceService: InvoiceService,
    private pdfService: PdfService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.loading = true;
    this.invoiceService.getInvoices().pipe(
      catchError(error => {
        console.error('Error loading invoices:', error);
        this.error = 'Failed to load invoices. Please try again later.';
        this.loading = false;
        return of([]);
      })
    ).subscribe(invoices => {
      this.invoices = invoices;
      this.calculateStatistics();
      this.applyFilters();
      this.loading = false;
    });
  }

  calculateStatistics(): void {
    const now = new Date();
    this.statistics = {
      total: this.invoices.length,
      paid: this.invoices.filter(i => i.isPaid).length,
      pending: this.invoices.filter(i => !i.isPaid && new Date(i.dueDate) > now).length,
      overdue: this.invoices.filter(i => !i.isPaid && new Date(i.dueDate) <= now).length,
      totalAmount: this.invoices.reduce((sum, i) => sum + i.totalAmount, 0),
      averageAmount: this.invoices.length ? 
        this.invoices.reduce((sum, i) => sum + i.totalAmount, 0) / this.invoices.length : 0
    };
  }

  applyFilters(): void {
    // Apply search and filters
    this.filteredInvoices = this.invoices.filter(invoice => {
      const matchesSearch = 
        invoice.id.toString().includes(this.searchTerm) ||
        invoice.recipientEmail.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = 
        this.statusFilter === 'ALL' ||
        (this.statusFilter === 'PAID' && invoice.isPaid) ||
        (this.statusFilter === 'PENDING' && !invoice.isPaid);

      const matchesDate = 
        this.dateFilter === 'ALL' ||
        (this.dateFilter === 'TODAY' && this.isToday(new Date(invoice.dueDate))) ||
        (this.dateFilter === 'WEEK' && this.isThisWeek(new Date(invoice.dueDate))) ||
        (this.dateFilter === 'MONTH' && this.isThisMonth(new Date(invoice.dueDate)));

      return matchesSearch && matchesStatus && matchesDate;
    });

    // Apply sorting
    this.sortInvoices();

    // Update pagination
    this.totalItems = this.filteredInvoices.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages);
  }

  sortInvoices(): void {
    this.filteredInvoices.sort((a, b) => {
      let comparison = 0;
      switch (this.sortBy) {
        case 'amount':
          comparison = a.totalAmount - b.totalAmount;
          break;
        case 'date':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'status':
          comparison = (a.isPaid ? 1 : 0) - (b.isPaid ? 1 : 0);
          break;
      }
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  // Date helper methods
  private isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  private isThisWeek(date: Date): boolean {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return date >= weekStart && date <= weekEnd;
  }

  private isThisMonth(date: Date): boolean {
    const today = new Date();
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  }

  // Pagination methods
  get paginatedInvoices(): Invoice[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredInvoices.slice(start, start + this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  // Navigation methods
  viewInvoice(id: number): void {
    this.router.navigate(['/invoices', id]);
  }

  createInvoice(): void {
    this.router.navigate(['/invoices/create']);
  }

  // Helper methods for template
  getStatusBadgeClass(isPaid: boolean): string {
    return isPaid ? 'badge bg-success' : 'badge bg-warning';
  }

  getStatusText(isPaid: boolean): string {
    return isPaid ? 'Paid' : 'Pending';
  }

  async downloadPdf(id: number): Promise<void> {
    try {
      const invoice = this.invoices.find(i => i.id === id);
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      const pdfBlob = await this.pdfService.generateInvoicePdf(invoice);
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoice.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      this.error = 'Failed to generate PDF. Please try again.';
    }
  }
} 