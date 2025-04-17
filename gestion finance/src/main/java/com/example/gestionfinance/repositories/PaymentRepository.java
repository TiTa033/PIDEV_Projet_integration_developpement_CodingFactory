package com.example.gestionfinance.repositories;

import com.example.gestionfinance.entities.Payment;
import com.example.gestionfinance.entities.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStatus(PaymentStatus status);
    
    List<Payment> findByDueDateBefore(LocalDate date);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED'")
    Double getTotalPaidAmount();
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'PENDING'")
    Double getTotalOutstandingAmount();
    
    List<Payment> findByPaymentDateBetween(LocalDate startDate, LocalDate endDate);
}
