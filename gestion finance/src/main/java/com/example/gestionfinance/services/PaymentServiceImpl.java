package com.example.gestionfinance.services;

import com.example.gestionfinance.dto.PaymentReportDTO;
import com.example.gestionfinance.entities.*;
import com.example.gestionfinance.repositories.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final InstallmentRepository installmentRepository;
    private final PDFGeneratorService pdfGeneratorService;
    private final EmailService emailService;

    @Override
    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    @Override
    public Payment updatePayment(Long id, Payment payment) {
        Payment existingPayment = getPayment(id);
        existingPayment.setAmount(payment.getAmount());
        existingPayment.setMethod(payment.getMethod());
        existingPayment.setStatus(payment.getStatus());
        existingPayment.setPaymentDate(payment.getPaymentDate());
        existingPayment.setDueDate(payment.getDueDate());
        return paymentRepository.save(existingPayment);
    }

    @Override
    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }

    @Override
    public Payment getPayment(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found with id: " + id));
    }

    @Override
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @Override
    public Invoice createInvoice(Invoice invoice) {
        // Initialize installments if any
        if (invoice.getInstallments() != null) {
            invoice.getInstallments().forEach(installment -> {
                installment.setInvoice(invoice);
                installmentRepository.save(installment);
            });
        }
        return invoiceRepository.save(invoice);
    }

    @Override
    public void sendInvoiceByEmail(Long invoiceId, String email) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new EntityNotFoundException("Invoice not found with id: " + invoiceId));
        
        byte[] pdfContent = generateInvoicePDF(invoiceId);
        
        emailService.sendInvoiceEmail(
            email,
            "Invoice #" + invoice.getId(),
            "Please find attached the invoice for your payment.",
            pdfContent,
            "invoice_" + invoice.getId() + ".pdf"
        );
    }

    @Override
    public byte[] generateInvoicePDF(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new EntityNotFoundException("Invoice not found with id: " + invoiceId));
        return pdfGeneratorService.generateInvoicePDF(invoice);
    }

    @Override
    public PaymentReportDTO generatePaymentReport(LocalDate startDate, LocalDate endDate) {
        List<Payment> payments = paymentRepository.findByPaymentDateBetween(startDate, endDate);
        
        return PaymentReportDTO.builder()
                .startDate(startDate)
                .endDate(endDate)
                .totalIncome(payments.stream()
                        .filter(p -> p.getStatus() == PaymentStatus.COMPLETED)
                        .mapToDouble(Payment::getAmount)
                        .sum())
                .totalOutstanding(getTotalOutstandingAmount())
                .totalPaidAmount(getTotalPaidAmount())
                .totalPayments(payments.size())
                .completedPayments((int) payments.stream()
                        .filter(p -> p.getStatus() == PaymentStatus.COMPLETED)
                        .count())
                .pendingPayments((int) payments.stream()
                        .filter(p -> p.getStatus() == PaymentStatus.PENDING)
                        .count())
                .failedPayments((int) payments.stream()
                        .filter(p -> p.getStatus() == PaymentStatus.FAILED)
                        .count())
                .build();
    }

    @Override
    public List<Payment> getOverduePayments() {
        return paymentRepository.findByDueDateBefore(LocalDate.now());
    }

    @Override
    public Double getTotalOutstandingAmount() {
        return paymentRepository.getTotalOutstandingAmount();
    }

    @Override
    public Double getTotalPaidAmount() {
        return paymentRepository.getTotalPaidAmount();
    }
}
