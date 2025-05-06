package tn.esprit.pidev.services;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import tn.esprit.pidev.entities.PredictionRequestDTO;

@Service
public class MLPredictionService {

    private final String FLASK_API_URL = "http://localhost:5000/predict";
    private final RestTemplate restTemplate;

    public MLPredictionService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Integer predictGrade(PredictionRequestDTO request) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<PredictionRequestDTO> entity = new HttpEntity<>(request, headers);

            ResponseEntity<PredictionResponse> response = restTemplate.exchange(
                    FLASK_API_URL,
                    HttpMethod.POST,
                    entity,
                    PredictionResponse.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody().getPredictedGrade();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    // Add this inner class to properly map the response
    private static class PredictionResponse {
        private int predicted_grade;
        private String status;

        // Getters and Setters
        public int getPredictedGrade() {
            return predicted_grade;
        }

        public void setPredicted_grade(int predicted_grade) {
            this.predicted_grade = predicted_grade;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}