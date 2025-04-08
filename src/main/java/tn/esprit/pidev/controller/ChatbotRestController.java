package tn.esprit.pidev.controller;

import org.springframework.web.bind.annotation.*;
import tn.esprit.pidev.services.ChatbotService;
import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "http://localhost:4200")
public class ChatbotRestController {
    private final ChatbotService chatbotService;

    public ChatbotRestController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping
    public Map<String, String> chat(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        String response = chatbotService.getChatbotResponse(userMessage);
        return Map.of("reply", response);
    }
}
