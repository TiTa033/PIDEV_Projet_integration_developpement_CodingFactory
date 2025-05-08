package com.example.gestionfinance.services;

import com.example.gestionfinance.dto.PaymentReportDTO;
import com.example.gestionfinance.entities.Invoice;
import com.example.gestionfinance.entities.Payment;

import java.time.LocalDate;
import java.util.List;

public interface PaymentService {
    Payment createPayment(Payment payment);
    Payment updatePayment(Long id, Payment payment);
    void deletePayment(Long id);
    Payment getPayment(Long id);
    List<Payment> getAllPayments();
    
    Invoice createInvoice(Invoice invoice);
    void sendInvoiceByEmail(Long invoiceId, String email);
    byte[] generateInvoicePDF(Long invoiceId);
    
    PaymentReportDTO generatePaymentReport(LocalDate startDate, LocalDate endDate);
    List<Payment> getOverduePayments();
    Double getTotalOutstandingAmount();
    Double getTotalPaidAmount();
}
