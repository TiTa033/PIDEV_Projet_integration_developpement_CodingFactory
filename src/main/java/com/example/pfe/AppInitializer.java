package com.example.pfe;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.io.IOException;

@Component
public class AppInitializer {
    @PostConstruct
    public void init() throws IOException {
        Files.createDirectories(Paths.get("uploads/"));
    }
}