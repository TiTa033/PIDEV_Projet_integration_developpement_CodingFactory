package com.example.gestionfinance.repositories;

import com.example.gestionfinance.entities.Installment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface InstallmentRepository extends JpaRepository<Installment, Long> {
    List<Installment> findByInvoiceId(Long invoiceId);
    List<Installment> findByIsPaidAndDueDateBefore(boolean isPaid, LocalDate date);
}
