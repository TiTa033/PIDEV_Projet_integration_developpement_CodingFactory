package tn.esprit.pidev.services;

import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;

@Service
public class OcrService {
  public String extractTextFromImage(MultipartFile file) throws Exception {
    File tempFile = File.createTempFile("certif", file.getOriginalFilename());
    file.transferTo(tempFile);

    ITesseract instance = new Tesseract();
    instance.setDatapath(new ClassPathResource("tessdata").getFile().getAbsolutePath());
    instance.setLanguage("fra+eng"); // Support multilingue
    instance.setTessVariable("user_defined_dpi", "300"); // Meilleure qualité pour les PDF
    instance.setPageSegMode(6); // Mode segmention automatique avec OSD
    instance.setOcrEngineMode(3); // Mode LSTM seulement

    String result = instance.doOCR(tempFile);
    tempFile.delete();

    // Nettoyage supplémentaire du texte
    return cleanText(result);
  }

  private String cleanText(String text) {
    // Normalisation plus poussée
    return text.replaceAll("[^a-zA-Z0-9\\sàâäéèêëîïôöùûüçÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ]", " ")
      .replaceAll("\\s+", " ")
      .trim()
      .toLowerCase();
  }
}
