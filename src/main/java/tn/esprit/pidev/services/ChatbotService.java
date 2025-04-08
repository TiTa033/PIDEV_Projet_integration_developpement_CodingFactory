package tn.esprit.pidev.services;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class ChatbotService {

    private final Map<String, String> coursInfo;

    public ChatbotService() {
        coursInfo = new HashMap<>();
        coursInfo.put("Java", "Le cours de Java est enseigné par M. Dupont et a lieu le lundi à 10h.");
        coursInfo.put("Spring Boot", "Le cours de Spring Boot est enseigné par Mme Lemoine et a lieu le mercredi à 14h.");
        coursInfo.put("Big Data", "Le cours de Big Data est enseigné par Dr. Ben Ali et a lieu le vendredi à 9h.");
    }

    public String getChatbotResponse(String userMessage) {
        userMessage = userMessage.toLowerCase();

        if (userMessage.contains("cours disponibles")) {
            return "Les cours disponibles sont : " + String.join(", ", coursInfo.keySet());
        }

        for (String cours : coursInfo.keySet()) {
            if (userMessage.contains(cours.toLowerCase())) {
                return coursInfo.get(cours);
            }
        }

        return "Désolé, je ne comprends pas votre question. Essayez de demander par exemple : 'Quels cours sont disponibles ?' ou 'Qui enseigne Java ?'";
    }
}
