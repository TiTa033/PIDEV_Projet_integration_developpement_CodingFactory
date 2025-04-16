package com.example.pfe;

import java.util.Set;
import java.util.HashSet;

public class TextPreprocessor {
    private static final Set<String> STOP_WORDS = new HashSet<>(Set.of(
            "le", "la", "l", "de", "des", "du", "et", "en", "dans", "pour", "sur", "avec", "par", "au", "aux", "ce", "cette", "un", "une", "est", "sont", "a", "ont"
    )); // French stop words

    public static String preprocess(String content) {
        if (content == null) {
            return "";
        }

        // Step 1: Remove OCR artifacts (e.g., "Re former" repetitions)
        content = content.replaceAll("(?i)(Re former\\s*){50,}", "");

        // Step 2: Normalize text
        content = content.toLowerCase();
        content = content.replaceAll("[^a-zA-Z0-9\\s]", ""); // Remove punctuation
        content = content.replaceAll("\\s+", " "); // Normalize whitespace

        // Step 3: Remove stop words
        String[] words = content.split("\\s+");
        StringBuilder cleanedContent = new StringBuilder();
        for (String word : words) {
            if (!STOP_WORDS.contains(word)) {
                cleanedContent.append(word).append(" ");
            }
        }
        content = cleanedContent.toString().trim();

        // Step 4: Remove boilerplate (e.g., "figure 1 shows", "in this chapter")
        content = content.replaceAll("(?i)(figure\\s*\\d+\\s*:\\s*.+)", "");
        content = content.replaceAll("(?i)(dans\\s*ce\\s*chapitre)", "");
        content = content.replaceAll("(?i)(je\\s*remercie)", "");

        return content;
    }
}