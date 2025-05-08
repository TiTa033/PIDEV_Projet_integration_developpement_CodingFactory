package com.example.gestionfinance.services;

import com.example.gestionfinance.entities.Invoice;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j
public class PDFGeneratorService {

    public byte[] generateInvoicePDF(Invoice invoice) {
        try {
            Document document = new Document();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, out);

            document.open();

            // Add Title
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("INVOICE", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" ")); // Space

            // Add Invoice Details
            document.add(new Paragraph("Invoice #: " + invoice.getId()));
            document.add(new Paragraph("Date: " + invoice.getCreatedAt().format(DateTimeFormatter.ISO_DATE)));
            document.add(new Paragraph("Due Date: " + invoice.getDueDate().format(DateTimeFormatter.ISO_DATE)));
            document.add(new Paragraph(" ")); // Space

            // Add Payment Details
            document.add(new Paragraph("Payment Method: " + invoice.getPayment().getMethod()));
            document.add(new Paragraph("Payment Status: " + invoice.getPayment().getStatus()));
            document.add(new Paragraph("Total Amount: $" + invoice.getTotalAmount()));
            document.add(new Paragraph(" ")); // Space

            // Add Installments if any
            if (invoice.getInstallments() != null && !invoice.getInstallments().isEmpty()) {
                document.add(new Paragraph("Installments:", FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
                invoice.getInstallments().forEach(installment -> {
                    try {
                        document.add(new Paragraph("- Amount: $" + installment.getAmount() + 
                                                 ", Due Date: " + installment.getDueDate().format(DateTimeFormatter.ISO_DATE) +
                                                 ", Paid: " + (installment.isPaid() ? "Yes" : "No")));
                    } catch (DocumentException e) {
                        log.error("Error adding installment details to PDF", e);
                    }
                });
            }

            document.close();
            return out.toByteArray();
        } catch (DocumentException e) {
            log.error("Error generating PDF", e);
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }
}
