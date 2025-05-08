package com.example.gestionfinance.repositories;

import com.example.gestionfinance.entities.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByIsPaid(boolean isPaid);
}
