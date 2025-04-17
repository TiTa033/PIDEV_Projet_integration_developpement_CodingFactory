import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Invoice } from './invoice.service';

interface EmailOptions {
  to: string;
  subject: string;
  body: string;
  attachments?: Array<{
    filename: string;
    content: Blob;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private baseUrl = `${environment.apiUrl}/email`;

  constructor(private http: HttpClient) {}

  sendInvoiceCreated(invoice: Invoice): Promise<void> {
    const options: EmailOptions = {
      to: invoice.recipientEmail,
      subject: `New Invoice #${invoice.id}`,
      body: this.generateInvoiceCreatedEmail(invoice)
    };
    return this.sendEmail(options);
  }

  sendInvoicePaid(invoice: Invoice): Promise<void> {
    const options: EmailOptions = {
      to: invoice.recipientEmail,
      subject: `Invoice #${invoice.id} Paid`,
      body: this.generateInvoicePaidEmail(invoice)
    };
    return this.sendEmail(options);
  }

  sendInvoiceReminder(invoice: Invoice): Promise<void> {
    const options: EmailOptions = {
      to: invoice.recipientEmail,
      subject: `Reminder: Invoice #${invoice.id} Due Soon`,
      body: this.generateInvoiceReminderEmail(invoice)
    };
    return this.sendEmail(options);
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('to', options.to);
      formData.append('subject', options.subject);
      formData.append('body', options.body);

      if (options.attachments) {
        options.attachments.forEach((attachment, index) => {
          formData.append(`attachments[${index}][filename]`, attachment.filename);
          formData.append(`attachments[${index}][content]`, attachment.content);
        });
      }

      await this.http.post(`${this.baseUrl}/send`, formData).toPromise();
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  private generateInvoiceCreatedEmail(invoice: Invoice): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">New Invoice Created</h2>
        <p>Dear Customer,</p>
        <p>A new invoice has been created for you:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Invoice #:</strong> ${invoice.id}</p>
          <p><strong>Amount:</strong> $${invoice.totalAmount.toFixed(2)}</p>
          <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
          <p><strong>Description:</strong> ${invoice.description || 'Invoice Payment'}</p>
        </div>

        <p>Please make the payment by the due date to avoid any late fees.</p>
        <p>You can view and pay this invoice by clicking the link below:</p>
        <a href="${window.location.origin}/invoices/${invoice.id}" 
           style="display: inline-block; background-color: #007bff; color: white; 
                  padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          View Invoice
        </a>

        <p>Thank you for your business!</p>
        <p>Best regards,<br>Your Company Name</p>
      </div>
    `;
  }

  private generateInvoicePaidEmail(invoice: Invoice): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Invoice Paid</h2>
        <p>Dear Customer,</p>
        <p>Thank you for your payment. Your invoice has been marked as paid:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Invoice #:</strong> ${invoice.id}</p>
          <p><strong>Amount Paid:</strong> $${invoice.totalAmount.toFixed(2)}</p>
          <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <p>A receipt has been attached to this email for your records.</p>
        <p>Thank you for your business!</p>
        <p>Best regards,<br>Your Company Name</p>
      </div>
    `;
  }

  private generateInvoiceReminderEmail(invoice: Invoice): string {
    const daysUntilDue = Math.ceil((new Date(invoice.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Invoice Payment Reminder</h2>
        <p>Dear Customer,</p>
        <p>This is a friendly reminder that your invoice is due in ${daysUntilDue} days:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Invoice #:</strong> ${invoice.id}</p>
          <p><strong>Amount Due:</strong> $${invoice.totalAmount.toFixed(2)}</p>
          <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
        </div>

        <p>Please make the payment by the due date to avoid any late fees.</p>
        <p>You can view and pay this invoice by clicking the link below:</p>
        <a href="${window.location.origin}/invoices/${invoice.id}" 
           style="display: inline-block; background-color: #007bff; color: white; 
                  padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          View Invoice
        </a>

        <p>Thank you for your business!</p>
        <p>Best regards,<br>Your Company Name</p>
      </div>
    `;
  }
} 