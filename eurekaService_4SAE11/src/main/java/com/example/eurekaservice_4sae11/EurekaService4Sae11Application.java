package com.example.eurekaservice_4sae11;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class EurekaService4Sae11Application {

    public static void main(String[] args) {
        SpringApplication.run(EurekaService4Sae11Application.class, args);
    }

}
