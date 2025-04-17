package com.example.gestionfinance.controllers;

import com.example.gestionfinance.dto.PaymentReportDTO;
import com.example.gestionfinance.entities.Invoice;
import com.example.gestionfinance.entities.Payment;
import com.example.gestionfinance.services.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Payment> createPayment(@Valid @RequestBody Payment payment) {
        return ResponseEntity.ok(paymentService.createPayment(payment));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Payment> updatePayment(@PathVariable Long id, @Valid @RequestBody Payment payment) {
        return ResponseEntity.ok(paymentService.updatePayment(id, payment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPayment(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPayment(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @PostMapping("/invoices")
    public ResponseEntity<Invoice> createInvoice(@Valid @RequestBody Invoice invoice) {
        return ResponseEntity.ok(paymentService.createInvoice(invoice));
    }

    @PostMapping("/invoices/{id}/send")
    public ResponseEntity<Void> sendInvoiceByEmail(
            @PathVariable Long id,
            @RequestParam String email) {
        paymentService.sendInvoiceByEmail(id, email);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/invoices/{id}/pdf")
    public ResponseEntity<byte[]> downloadInvoicePDF(@PathVariable Long id) {
        byte[] pdfContent = paymentService.generateInvoicePDF(id);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "invoice_" + id + ".pdf");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfContent);
    }

    @GetMapping("/reports")
    public ResponseEntity<PaymentReportDTO> getPaymentReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(paymentService.generatePaymentReport(startDate, endDate));
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<Payment>> getOverduePayments() {
        return ResponseEntity.ok(paymentService.getOverduePayments());
    }

    @GetMapping("/statistics/outstanding")
    public ResponseEntity<Double> getTotalOutstandingAmount() {
        return ResponseEntity.ok(paymentService.getTotalOutstandingAmount());
    }

    @GetMapping("/statistics/paid")
    public ResponseEntity<Double> getTotalPaidAmount() {
        return ResponseEntity.ok(paymentService.getTotalPaidAmount());
    }
}
