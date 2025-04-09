package tn.esprit.pidev.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pidev.services.TwilioService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/twilio")
public class TwilioRestController {

    @Autowired
    TwilioService twilioService;

    @PostMapping("/send-sms")
    public String sendSms(@RequestParam String toPhoneNumber, @RequestParam String messageBody) {
        try {
            System.out.println("Message reçu : " + messageBody);
            twilioService.sendSms(toPhoneNumber, messageBody);
            return "SMS sent successfully";
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to send SMS: " + e.getMessage();
        }
    }
}