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
        // chemin vers le dossier tessdata dans resources
        File tessDataFolder = new ClassPathResource("tessdata").getFile();
        instance.setDatapath(tessDataFolder.getAbsolutePath());
        instance.setLanguage("fra");

        String result = instance.doOCR(tempFile);
        tempFile.delete();
        return result;
    }
}