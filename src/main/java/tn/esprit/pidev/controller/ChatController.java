package tn.esprit.pidev.controller;

import org.springframework.boot.configurationprocessor.json.JSONException;
import tn.esprit.pidev.services.ChatService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/chat")
public class ChatController {

   ChatService chatService;

    @PostMapping("/ask")
    public String askChatbot(@RequestBody String userMessage) throws JSONException {
        return chatService.getResponseFromChatbot(userMessage);
    }
}
