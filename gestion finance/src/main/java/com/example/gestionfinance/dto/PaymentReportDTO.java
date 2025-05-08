package com.example.gestionfinance.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentReportDTO {
    double totalIncome;
    double totalOutstanding;
    double totalPaidAmount;
    LocalDate startDate;
    LocalDate endDate;
    int totalPayments;
    int completedPayments;
    int pendingPayments;
    int failedPayments;
}
