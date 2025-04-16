package com.example.pfe;

import java.util.HashSet;
import java.util.Set;

public class NGramsGenerator {
    public static Set<String> generateNGrams(String text, int n) {
        Set<String> ngrams = new HashSet<>();
        if (text == null || text.trim().isEmpty()) {
            return ngrams;
        }

        String[] words = text.split("\\s+");
        for (int i = 0; i <= words.length - n; i++) {
            StringBuilder ngram = new StringBuilder();
            for (int j = 0; j < n; j++) {
                ngram.append(words[i + j]).append(" ");
            }
            ngrams.add(ngram.toString().trim());
        }
        return ngrams;
    }
}