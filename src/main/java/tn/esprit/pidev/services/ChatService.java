package tn.esprit.pidev.services;

import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.stereotype.Service;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.web.client.RestTemplate;

@Service
public class ChatService {

    private static final String API_KEY = "AIzaSyCaOHzKfLHeyFcsqOIDMBJXbmsOPok7KLA"; // Replace with your Gemini API key
    private static final String API_URL = "https://api.gemini.com/v1/ask"; // Replace with Gemini API URL

    private final RestTemplate restTemplate;

    public ChatService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getResponseFromChatbot(String userMessage) throws JSONException {
        // Create the JSON body for the request
        JSONObject requestBody = new JSONObject();
        requestBody.put("message", userMessage);

        // Create headers and add API key for authentication
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + API_KEY);
        headers.set("Content-Type", "application/json");

        // Create the HttpEntity with headers and body
        HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

        // Send POST request to Gemini API
        ResponseEntity<String> response = restTemplate.exchange(API_URL, HttpMethod.POST, entity, String.class);

        // Return the response body
        return response.getBody();
    }
}
