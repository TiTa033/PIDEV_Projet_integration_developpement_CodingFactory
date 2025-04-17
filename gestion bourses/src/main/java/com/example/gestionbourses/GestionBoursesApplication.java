package com.example.gestionbourses;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class GestionBoursesApplication {

    public static void main(String[] args) {
        SpringApplication.run(GestionBoursesApplication.class, args);
    }

}
