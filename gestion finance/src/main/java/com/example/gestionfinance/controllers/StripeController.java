package com.example.gestionfinance.controllers;

import com.example.gestionfinance.dto.PaymentIntentDTO;
import com.example.gestionfinance.services.StripeService;
import com.stripe.exception.StripeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:4200")
public class StripeController {

    @Autowired
    private StripeService stripeService;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(@RequestBody PaymentIntentDTO paymentIntentDTO) {
        try {
            String clientSecret = stripeService.createPaymentIntent(
                paymentIntentDTO.getAmount(),
                paymentIntentDTO.getCurrency()
            );

            Map<String, String> response = new HashMap<>();
            response.put("clientSecret", clientSecret);
            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/payment-intent/{id}")
    public ResponseEntity<?> getPaymentIntent(@PathVariable String id) {
        try {
            return ResponseEntity.ok(stripeService.retrievePaymentIntent(id));
        } catch (StripeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 