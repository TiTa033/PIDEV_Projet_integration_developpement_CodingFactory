import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Invoice } from './invoice.service';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor() {}

  async generateInvoicePdf(invoice: Invoice): Promise<Blob> {
    // Create a temporary div to hold the invoice content
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = '-9999px';
    document.body.appendChild(div);

    // Generate the HTML content
    div.innerHTML = this.generateInvoiceHtml(invoice);

    // Convert HTML to canvas
    const canvas = await html2canvas(div, {
      scale: 2,
      useCORS: true,
      logging: false
    });

    // Remove the temporary div
    document.body.removeChild(div);

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    return pdf.output('blob');
  }

  private generateInvoiceHtml(invoice: Invoice): string {
    return `
      <div class="invoice-pdf" style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c3e50;">INVOICE</h1>
          <p style="color: #7f8c8d;">#${invoice.id}</p>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div>
            <h3 style="color: #2c3e50;">From</h3>
            <p>Your Company Name</p>
            <p>123 Business Street</p>
            <p>City, State, ZIP</p>
          </div>
          <div>
            <h3 style="color: #2c3e50;">To</h3>
            <p>${invoice.recipientEmail}</p>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Description</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Amount</th>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">${invoice.description || 'Invoice Payment'}</td>
              <td style="padding: 10px; text-align: right; border-bottom: 1px solid #dee2e6;">$${invoice.totalAmount.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: right; margin-bottom: 30px;">
          <p><strong>Total: $${invoice.totalAmount.toFixed(2)}</strong></p>
          <p>Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}</p>
          <p>Status: ${invoice.isPaid ? 'Paid' : 'Pending'}</p>
        </div>

        <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #dee2e6;">
          <p style="text-align: center; color: #7f8c8d;">
            Thank you for your business!
          </p>
        </div>
      </div>
    `;
  }
} 