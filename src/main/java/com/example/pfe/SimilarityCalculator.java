package com.example.pfe;

import java.util.HashSet;
import java.util.Set;

public class SimilarityCalculator {
    public static double computeJaccardSimilarity(Set<String> ngrams1, Set<String> ngrams2) {
        if (ngrams1.isEmpty() || ngrams2.isEmpty()) {
            return 0.0;
        }

        // Compute intersection
        Set<String> intersection = new HashSet<>(ngrams1);
        intersection.retainAll(ngrams2);

        // Compute union
        Set<String> union = new HashSet<>(ngrams1);
        union.addAll(ngrams2);

        // Jaccard Similarity = |intersection| / |union|
        return (double) intersection.size() / union.size();
    }
}