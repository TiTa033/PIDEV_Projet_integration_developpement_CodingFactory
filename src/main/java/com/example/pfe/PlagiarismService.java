package com.example.pfe;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlagiarismService {
    private static final Logger logger = LoggerFactory.getLogger(PlagiarismService.class);

    @Autowired
    private PFERepository pfeRepository;

    @Autowired
    private FileProcessingService fileProcessingService;

    @Autowired
    private NGramsPlagiarismChecker plagiarismChecker;

    // Overloaded method for standalone plagiarism check (used by PlagiarismeRestController)
    public double checkPlagiarism(byte[] newReportBytes) throws IOException {
        return checkPlagiarism(newReportBytes, null); // Pass null for currentPfeId
    }

    public double checkPlagiarism(byte[] newReportBytes, Long currentPfeId) throws IOException {
        logger.info("Starting plagiarism check for new report with PFE ID: {}", currentPfeId);

        // Extract text from the new report
        String newReportText = fileProcessingService.extractTextFromBytes(newReportBytes);
        if (newReportText == null || newReportText.trim().isEmpty()) {
            logger.warn("New report is empty or invalid");
            throw new IllegalArgumentException("Le rapport soumis est vide ou non valide !");
        }

        // Fetch all existing reports, excluding the current PFE if currentPfeId is provided
        List<PFE> allPfeReports = pfeRepository.findAll();
        if (currentPfeId != null) {
            allPfeReports = allPfeReports.stream()
                    .filter(pfe -> !pfe.getId().equals(currentPfeId))
                    .collect(Collectors.toList());
        }

        if (allPfeReports.isEmpty()) {
            logger.info("No existing reports to compare");
            return 0.0;
        }

        // Extract text from existing reports by reading from rapportPath
        List<String> oldReportsTexts = allPfeReports.stream()
                .filter(pfe -> pfe.getRapportPath() != null)
                .map(pfe -> {
                    try {
                        byte[] fileData = Files.readAllBytes(Paths.get(pfe.getRapportPath()));
                        return fileProcessingService.extractTextFromBytes(fileData);
                    } catch (IOException e) {
                        logger.error("Error reading report at path {}: {}", pfe.getRapportPath(), e.getMessage());
                        return null;
                    }
                })
                .filter(text -> text != null && !text.trim().isEmpty())
                .collect(Collectors.toList());

        if (oldReportsTexts.isEmpty()) {
            logger.info("No valid existing reports to compare");
            return 0.0;
        }

        // Compute similarity with N-grams Matching
        double maxSimilarity = 0.0;
        for (String oldText : oldReportsTexts) {
            double similarity = plagiarismChecker.computeSimilarity(newReportText, oldText);
            maxSimilarity = Math.max(maxSimilarity, similarity);
        }

        logger.info("Plagiarism check completed. Max similarity: {}", maxSimilarity);
        return maxSimilarity * 100;
    }
}