package com.example.pfe;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class NGramsPlagiarismChecker {
    private static final Logger logger = LoggerFactory.getLogger(NGramsPlagiarismChecker.class);
    private static final int N = 3;

    public double computeSimilarity(String content1, String content2) {
        try {
            logger.info("Starting plagiarism check for two documents");

            // Step 1: Preprocess the text
            logger.debug("Preprocessing content1");
            String cleanedContent1 = TextPreprocessor.preprocess(content1);
            logger.debug("Preprocessing content2");
            String cleanedContent2 = TextPreprocessor.preprocess(content2);

            // Step 2: Generate N-grams
            logger.debug("Generating N-grams for content1");
            Set<String> ngrams1 = NGramsGenerator.generateNGrams(cleanedContent1, N);
            logger.debug("Generating N-grams for content2");
            Set<String> ngrams2 = NGramsGenerator.generateNGrams(cleanedContent2, N);

            // Step 3: Compute Jaccard similarity
            logger.debug("Computing Jaccard similarity");
            double similarity = SimilarityCalculator.computeJaccardSimilarity(ngrams1, ngrams2);
            logger.info("Plagiarism similarity score: {}", similarity);

            return similarity;
        } catch (Exception e) {
            logger.error("Error during plagiarism check: {}", e.getMessage(), e);
            return 0.0;
        }
    }
}