package com.example.gestionfinance.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender emailSender;

    public void sendInvoiceEmail(String to, String subject, String text, byte[] pdfContent, String fileName) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text);
            
            // Attach PDF
            helper.addAttachment(fileName, new ByteArrayResource(pdfContent));
            
            emailSender.send(message);
            log.info("Invoice email sent successfully to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send invoice email", e);
            throw new RuntimeException("Failed to send invoice email", e);
        }
    }
}
