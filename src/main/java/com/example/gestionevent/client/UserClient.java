package com.example.gestionevent.client;

import com.example.gestionevent.entity.UserDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class UserClient {

    private final RestTemplate restTemplate;

    // Inject the base URL of the user microservice from application.properties
    @Value("${user.service.url}")
    private String userServiceUrl;

    public UserClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public UserDTO getUserByEmail(String email) {
        String url = userServiceUrl + "/api/v1/users/email/" + email;
        return restTemplate.getForObject(url, UserDTO.class);
    }
}
