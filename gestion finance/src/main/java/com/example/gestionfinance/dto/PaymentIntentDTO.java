package com.example.gestionfinance.dto;

import lombok.Data;

@Data
public class PaymentIntentDTO {
    private Long amount;
    private String currency;
} 