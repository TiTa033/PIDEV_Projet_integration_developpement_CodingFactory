import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { PaymentService, Payment } from '../services/payment.service';
import { StripeService } from '../services/stripe.service';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { catchError, map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import {BaseChartDirective, NgChartsModule} from 'ng2-charts';
import {ChartConfiguration, ChartData, ChartType, ChartOptions, ChartDataset} from 'chart.js';
import { RouterModule } from '@angular/router';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';


interface PaymentHistory {
  date: string;
  status: string;
  description: string;
  amount?: number;
  method?: string;
}

interface PaymentAnalytics {
  totalAmount: number;
  averageAmount: number;
  monthlyTrend: { month: string; amount: number }[];
  methodDistribution: { method: string; count: number }[];
  statusDistribution: { status: string; count: number }[];
  dailyPayments: { date: string; amount: number }[];
  paymentMethods: { method: string; total: number }[];
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, FormsModule,NgChartsModule, RouterModule],
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit, OnDestroy {
  @ViewChild('cardElement') cardElement!: ElementRef;

  private elements: StripeElements | null = null;
  card: any;
  processingPayment = false;
  paymentError: string | null = null;
  cardMounted = false;
  showPaymentModal = false;
  private initializationAttempts = 0;
  private readonly MAX_INIT_ATTEMPTS = 3;

  payments$: Observable<Payment[]> = of([]);
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  loading = true;
  error = '';
  showPaymentForm = false;
  showPaymentDetails = false;
  selectedPayment: Payment | null = null;
  paymentHistory: PaymentHistory[] = [];

  // Filter and search properties
  searchTerm = '';
  statusFilter = 'ALL';
  methodFilter = 'ALL';
  sortBy = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';

  // New properties for enhanced features
  showAnalytics = false;
  showExportOptions = false;
  analytics: PaymentAnalytics = {
    totalAmount: 0,
    averageAmount: 0,
    monthlyTrend: [],
    methodDistribution: [],
    statusDistribution: [],
    dailyPayments: [],
    paymentMethods: []
  };

  // Chart configurations
  // For line chart


// For pie chart
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: 'Payment Methods Distribution'
      }
    }
  };

// For bar chart
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: 'Daily Payments'
      }
    }
  };


  public lineChartData: ChartData<'line'> = {
    labels: [] as string[], // Explicitly typing labels as an array of strings
    datasets: [
      {
        data: [] as number[], // Explicitly typing data as an array of numbers
        label: 'Monthly Payments',
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true
      }
    ] as ChartDataset<'line'>[] // Explicitly typing datasets as an array of ChartDataset<'line'>
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)'
        ]
      }
    ]
  };

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Daily Payments',
        backgroundColor: 'rgba(54, 162, 235, 0.7)'
      }
    ]
  };

  // Enhanced export functionality
  exportFormat: 'excel' | 'csv' | 'pdf' = 'excel';
  exportOptions = {
    includeHistory: false,
    includeAttachments: false,
    includeNotes: false,
    dateRange: 'all' as 'week' | 'month' | 'year' | 'all'
  };

  // Payment management features
  paymentCategories = ['Subscription', 'Service', 'Product', 'Other'];
  selectedCategory = 'Subscription';
  paymentTags: string[] = [];
  newTag = '';
  showTagInput = false;
  paymentRecurrence = {
    type: 'none' as 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly',
    interval: 1,
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  };

  // New payment form
  newPayment: Partial<Payment> = {
    amount: 0,
    method: 'CARD',
    status: 'PENDING',
    paymentDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  };

  // Add missing properties
  paymentNotes = '';
  showNotesForm = false;
  paymentAttachments: File[] = [];
  reminderDays = 7;

  constructor(
    private paymentService: PaymentService,
    private stripeService: StripeService,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    await this.initializeStripe();
    this.loadPayments();
  }

  private async initializeStripe() {
    try {
      const stripe = await this.stripeService.getStripe();
      if (stripe) {
        this.elements = stripe.elements();
        this.card = this.elements.create('card', {
          style: {
            base: {
              fontSize: '16px',
              color: '#32325d',
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSmoothing: 'antialiased',
              '::placeholder': {
                color: '#aab7c4'
              }
            },
            invalid: {
              color: '#fa755a',
              iconColor: '#fa755a'
            }
          }
        });

        // Wait for the next tick to ensure the element is in the DOM
        setTimeout(() => {
          if (this.cardElement?.nativeElement) {
            this.card.mount(this.cardElement.nativeElement);
            this.cardMounted = true;
            this.initializationAttempts = 0;

            this.card.addEventListener('change', (event: any) => {
              this.paymentError = event.error ? event.error.message : null;
            });
          } else {
            console.error('Card element not found in DOM');
            this.retryInitialization();
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error initializing Stripe:', error);
      this.retryInitialization();
    }
  }

  private retryInitialization() {
    if (this.initializationAttempts < this.MAX_INIT_ATTEMPTS) {
      this.initializationAttempts++;
      console.log(`Retrying Stripe initialization (attempt ${this.initializationAttempts})`);
      setTimeout(() => this.initializeStripe(), 1000); // Retry after 1 second
    } else {
      console.error('Failed to initialize Stripe after multiple attempts');
      this.snackBar.open('Failed to initialize payment system. Please refresh the page.', 'Close', { duration: 5000 });
    }
  }

  loadPayments(): void {
    this.loading = true;
    this.paymentService.getPayments().pipe(
      catchError(error => {
        console.error('Error fetching payments:', error);
        this.error = 'Failed to load payments. Please try again later.';
        this.loading = false;
        return of([]);
      })
    ).subscribe(payments => {
      this.payments = payments;
      this.applyFilters();
      this.calculateAnalytics();
      this.loading = false;
    });
  }

  viewPaymentDetails(payment: Payment): void {
    this.selectedPayment = payment;
    this.showPaymentDetails = true;
    this.loadPaymentHistory(payment);
  }

  loadPaymentHistory(payment: Payment): void {
    this.paymentHistory = [
      {
        date: payment.paymentDate,
        status: 'CREATED',
        description: 'Payment was created',
        amount: payment.amount,
        method: payment.method
      },
      {
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'PROCESSING',
        description: 'Payment is being processed',
        amount: payment.amount,
        method: payment.method
      },
      {
        date: new Date().toISOString().split('T')[0],
        status: payment.status,
        description: `Payment ${payment.status.toLowerCase()}`,
        amount: payment.amount,
        method: payment.method
      }
    ];
  }

  getPaymentStatusClass(status: string): string {
    switch (status) {
      case 'CREATED':
        return 'bg-info';
      case 'PROCESSING':
        return 'bg-warning';
      case 'COMPLETED':
        return 'bg-success';
      case 'FAILED':
        return 'bg-danger';
      case 'NOTE':
        return 'bg-secondary';
      case 'REMINDER':
        return 'bg-primary';
      default:
        return 'bg-secondary';
    }
  }

  getPaymentMethodDetails(method: string): { icon: string; description: string } {
    switch (method) {
      case 'CARD':
        return {
          icon: 'mdi mdi-credit-card',
          description: 'Credit/Debit Card Payment'
        };
      case 'BANK':
        return {
          icon: 'mdi mdi-bank',
          description: 'Bank Transfer'
        };
      case 'CASH':
        return {
          icon: 'mdi mdi-cash',
          description: 'Cash Payment'
        };
      default:
        return {
          icon: 'mdi mdi-help-circle',
          description: 'Unknown Payment Method'
        };
    }
  }

  calculateAnalytics(): void {
    const completedPayments = this.payments.filter(p => p.status === 'COMPLETED');
    const totalAmount = completedPayments.reduce((sum, p) => sum + p.amount, 0);

    this.analytics = {
      totalAmount,
      averageAmount: completedPayments.length ? totalAmount / completedPayments.length : 0,
      monthlyTrend: this.calculateMonthlyTrend(),
      methodDistribution: this.calculateMethodDistribution(),
      statusDistribution: this.calculateStatusDistribution(),
      dailyPayments: this.calculateDailyPayments(),
      paymentMethods: this.calculatePaymentMethods()
    };

    this.updateCharts();
  }

  updateCharts(): void {
    // Update line chart (monthly trend)
    this.lineChartData.labels = this.analytics.monthlyTrend.map(t => t.month);
    this.lineChartData.datasets[0].data = this.analytics.monthlyTrend.map(t => t.amount);

    // Update pie chart (method distribution)
    this.pieChartData.labels = this.analytics.methodDistribution.map(m => m.method);
    this.pieChartData.datasets[0].data = this.analytics.methodDistribution.map(m => m.count);

    // Update bar chart (daily payments)
    this.barChartData.labels = this.analytics.dailyPayments.map(d => d.date);
    this.barChartData.datasets[0].data = this.analytics.dailyPayments.map(d => d.amount);
  }

  calculateMonthlyTrend(): { month: string; amount: number }[] {
    const monthlyData = new Map<string, number>();
    this.payments.forEach(payment => {
      const month = payment.paymentDate.substring(0, 7);
      monthlyData.set(month, (monthlyData.get(month) || 0) + payment.amount);
    });
    return Array.from(monthlyData.entries())
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  calculateMethodDistribution(): { method: string; count: number }[] {
    const methodCount = new Map<string, number>();
    this.payments.forEach(payment => {
      methodCount.set(payment.method, (methodCount.get(payment.method) || 0) + 1);
    });
    return Array.from(methodCount.entries())
      .map(([method, count]) => ({ method, count }));
  }

  calculateStatusDistribution(): { status: string; count: number }[] {
    const statusCount = new Map<string, number>();
    this.payments.forEach(payment => {
      statusCount.set(payment.status, (statusCount.get(payment.status) || 0) + 1);
    });
    return Array.from(statusCount.entries())
      .map(([status, count]) => ({ status, count }));
  }

  calculateDailyPayments(): { date: string; amount: number }[] {
    const dailyData = new Map<string, number>();
    this.payments.forEach(payment => {
      dailyData.set(payment.paymentDate, (dailyData.get(payment.paymentDate) || 0) + payment.amount);
    });
    return Array.from(dailyData.entries())
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  calculatePaymentMethods(): { method: string; total: number }[] {
    const methodTotals = new Map<string, number>();
    this.payments.forEach(payment => {
      methodTotals.set(payment.method, (methodTotals.get(payment.method) || 0) + payment.amount);
    });
    return Array.from(methodTotals.entries())
      .map(([method, total]) => ({ method, total }));
  }

  exportPayments(): void {
    let data = this.filteredPayments.map(payment => ({
      'Payment ID': payment.id,
      'Amount': payment.amount,
      'Method': payment.method,
      'Status': payment.status,
      'Payment Date': payment.paymentDate,
      'Due Date': payment.dueDate,
      'Category': this.selectedCategory,
      'Tags': this.paymentTags.join(', ')
    }));

    if (this.exportOptions.includeHistory && this.selectedPayment) {
      data = data.map(payment => ({
        ...payment,
        'History': this.paymentHistory.map(h => `${h.date}: ${h.status} - ${h.description}`).join('\n')
      }));
    }

    if (this.exportFormat === 'excel') {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Payments');
      XLSX.writeFile(wb, 'payments.xlsx');
    } else if (this.exportFormat === 'csv') {
      const csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(data));
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'payments.csv';
      link.click();
    }
  }

  addPaymentNote(): void {
    if (this.selectedPayment && this.paymentNotes) {
      this.paymentHistory.push({
        date: new Date().toISOString().split('T')[0],
        status: 'NOTE',
        description: this.paymentNotes,
        amount: this.selectedPayment.amount,
        method: this.selectedPayment.method
      });
      this.paymentNotes = '';
      this.showNotesForm = false;
    }
  }

  handleFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.paymentAttachments = Array.from(input.files);
    }
  }

  setPaymentReminder(): void {
    if (this.selectedPayment) {
      const reminderDate = new Date(this.selectedPayment.dueDate);
      reminderDate.setDate(reminderDate.getDate() - this.reminderDays);

      this.paymentHistory.push({
        date: reminderDate.toISOString().split('T')[0],
        status: 'REMINDER',
        description: `Payment reminder set for ${this.reminderDays} days before due date`
      });
    }
  }

  applyFilters(): void {
    this.filteredPayments = this.payments.filter(payment => {
      const matchesSearch = payment.id?.toString().includes(this.searchTerm) ||
        payment.amount.toString().includes(this.searchTerm);
      const matchesStatus = this.statusFilter === 'ALL' || payment.status === this.statusFilter;
      const matchesMethod = this.methodFilter === 'ALL' || payment.method === this.methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });

    this.sortPayments();
  }

  sortPayments(): void {
    this.filteredPayments.sort((a, b) => {
      let comparison = 0;
      switch (this.sortBy) {
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'date':
          comparison = new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  createPayment(): void {
    if (this.newPayment.amount && this.newPayment.method) {
      this.paymentService.createPayment(this.newPayment as Payment).subscribe({
        next: (response) => {
          console.log('Payment created successfully:', response);
          this.showPaymentForm = false;
          this.resetNewPayment();
          this.loadPayments();
          alert('Payment created successfully!');
        },
        error: (error) => {
          console.error('Error creating payment:', error);
          alert('Error creating payment. Please try again.');
        }
      });
    }
  }

  resetNewPayment(): void {
    this.newPayment = {
      amount: 0,
      method: 'CARD',
      status: 'PENDING',
      paymentDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
  }

  async processPayment(payment: Payment) {
    this.selectedPayment = payment;
    this.showPaymentModal = true;
    this.paymentError = null;

    // Initialize Stripe if not already initialized
    if (!this.card || !this.cardMounted) {
      await this.initializeStripe();
    }
  }

  closePaymentModal() {
    this.showPaymentModal = false;
    this.paymentError = null;
    if (this.card) {
      this.card.unmount();
      this.cardMounted = false;
    }
  }

  async confirmPayment() {
    if (!this.selectedPayment) {
      return;
    }

    if (!this.card || !this.cardMounted) {
      this.snackBar.open('Payment system not initialized. Please try again.', 'Close', { duration: 3000 });
      return;
    }

    this.processingPayment = true;
    this.paymentError = null;

    try {
      // Process the payment through Stripe
      const result = await this.stripeService.processPayment(this.selectedPayment.amount, this.card);

      if (result.success) {
        // Update the existing payment status to COMPLETED
        await this.paymentService.updatePayment(this.selectedPayment.id!, {
          ...this.selectedPayment,
          status: 'COMPLETED'
        }).toPromise();

        this.snackBar.open('Payment successful!', 'Close', { duration: 3000 });
        this.loadPayments(); // Refresh the payments list
        this.closePaymentModal();
      } else {
        // Update the existing payment status to FAILED
        await this.paymentService.updatePayment(this.selectedPayment.id!, {
          ...this.selectedPayment,
          status: 'FAILED'
        }).toPromise();

        this.snackBar.open(result.error || 'Payment failed', 'Close', { duration: 3000 });
      }
    } catch (error) {
      console.error('Payment error:', error);
      this.snackBar.open('An error occurred during payment', 'Close', { duration: 3000 });
    } finally {
      this.processingPayment = false;
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'badge bg-success';
      case 'PENDING':
        return 'badge bg-warning';
      case 'FAILED':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  getMethodIcon(method: string): string {
    switch (method) {
      case 'CARD':
        return 'mdi mdi-credit-card';
      case 'BANK':
        return 'mdi mdi-bank';
      case 'CASH':
        return 'mdi mdi-cash';
      default:
        return 'mdi mdi-help-circle';
    }
  }

  getPaymentStats(): { total: number; completed: number; pending: number; failed: number } {
    return {
      total: this.payments.length,
      completed: this.payments.filter(p => p.status === 'COMPLETED').length,
      pending: this.payments.filter(p => p.status === 'PENDING').length,
      failed: this.payments.filter(p => p.status === 'FAILED').length
    };
  }

  // Payment management features
  addTag(): void {
    if (this.newTag && !this.paymentTags.includes(this.newTag)) {
      this.paymentTags.push(this.newTag);
      this.newTag = '';
      this.showTagInput = false;
    }
  }

  removeTag(tag: string): void {
    this.paymentTags = this.paymentTags.filter(t => t !== tag);
  }

  setRecurringPayment(): void {
    if (this.paymentRecurrence.type !== 'none') {
      const payment = this.newPayment as Payment;
      payment.recurrence = {
        type: this.paymentRecurrence.type,
        interval: this.paymentRecurrence.interval,
        endDate: this.paymentRecurrence.endDate
      };
    }
  }

  // Add cleanup on component destroy
  ngOnDestroy() {
    this.closePaymentModal();
  }
}
