package com.example.pfe;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/pfe")
public class PlagiarismeRestController {
    @Autowired
    private PlagiarismService plagiarismService;

    @PostMapping("/check")
    public ResponseEntity<Double> checkPlagiarism(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(0.0);
        }

        try {
            double similarityScore = plagiarismService.checkPlagiarism(file.getBytes());
            return ResponseEntity.ok(similarityScore);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(0.0);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(0.0);
        }
    }
}