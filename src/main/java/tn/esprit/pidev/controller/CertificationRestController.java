package tn.esprit.pidev.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pidev.entities.Certification;
import tn.esprit.pidev.services.ICertificationService;
import tn.esprit.pidev.services.QRCodeGenerator;
import com.google.zxing.WriterException;
import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.pidev.services.OcrService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@AllArgsConstructor
@RequestMapping("/certification")
public class CertificationRestController {

  private final ICertificationService certificationService;
  private final OcrService ocrService;

  @GetMapping("/retrieve-all-certifications")
  public List<Certification> getCertifications() {
    return certificationService.retrieveAllCertifications();
  }

  @GetMapping("/retrieve-certification/{certification-id}")
  public Certification retrieveCertification(@PathVariable("certification-id") Long certificationId) {
    return certificationService.retrieveCertification(certificationId);
  }

  @PostMapping("/add-certification")
  public Certification addCertification(@RequestBody Certification certification) {
    return certificationService.addCertification(certification);
  }

  @DeleteMapping("/remove-certification/{certification-id}")
  public void removeCertification(@PathVariable("certification-id") Long certificationId) {
    certificationService.removeCertification(certificationId);
  }

  @PutMapping("/modify-certification")
  public Certification modifyCertification(@RequestBody Certification certification) {
    return certificationService.modifyCertification(certification);
  }

  private String generateQRCodeText(Certification certification) {
    return "Nom: " + certification.getNom() +
      "\nOrganisme: " + certification.getOrganisme() +
      "\nDate: " + certification.getDateObtention();
  }

  @GetMapping("/generate-qrcode/{certification-id}")
  public ResponseEntity<String> generateQRCode(@PathVariable("certification-id") Long certificationId) {
    Certification certification = certificationService.retrieveCertification(certificationId);
    if (certification == null) return ResponseEntity.notFound().build();

    try {
      boolean isExpired = certificationService.isCertificationExpired(certification);
      int qrColor = isExpired ? 0xFFFF0000 : 0xFF00FF00;

      String qrCodeBase64 = QRCodeGenerator.generateQRCodeImage(
        generateQRCodeText(certification), 300, 300, qrColor, 0xFFFFFFFF
      );
      return ResponseEntity.ok(qrCodeBase64);
    } catch (WriterException | IOException e) {
      return ResponseEntity.internalServerError().body("Erreur de génération du QR Code");
    }
  }

  @GetMapping("/download-certification/{certification-id}")
  public ResponseEntity<byte[]> downloadCertification(@PathVariable("certification-id") Long certificationId) {
    try {
      byte[] pdfBytes = certificationService.generateCertificationPDF(certificationId);
      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.APPLICATION_PDF);
      headers.setContentDispositionFormData("attachment", "certification_" + certificationId + ".pdf");
      return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(null);
    }
  }

  @PostMapping("/verify-certification-image")
  public ResponseEntity<String> verifyCertificationFromImage(@RequestParam("image") MultipartFile imageFile) {
    try {
      String extractedText = ocrService.extractTextFromImage(imageFile);
      System.out.println("=== DEBUT VERIFICATION ===");
      System.out.println("Texte extrait nettoyé: " + extractedText);

      List<Certification> certifications = certificationService.retrieveAllCertifications();
      System.out.println("Nombre de certifications à vérifier: " + certifications.size());

      for (Certification certif : certifications) {
        System.out.println("\n--- Vérification certification ---");
        System.out.println("ID Certification: " + certif.getIdCertification());

        // Préparation des données à comparer
        String nomPattern = prepareForMatching(certif.getNom());
        String organismePattern = prepareForMatching(certif.getOrganisme());
        String datePattern = prepareDateForMatching(certif.getDateObtention());

        System.out.println("Nom certification: " + certif.getNom());
        System.out.println("Pattern nom: " + nomPattern);
        System.out.println("Pattern organisme: " + organismePattern);
        System.out.println("Pattern date: " + datePattern);

        // Vérification avec tolérance
        boolean nomMatch = containsWithTolerance(extractedText, nomPattern);
        boolean organismeMatch = containsWithTolerance(extractedText, organismePattern);
        boolean dateMatch = containsDate(extractedText, datePattern);

        System.out.println("Correspondance nom: " + nomMatch);
        System.out.println("Correspondance organisme: " + organismeMatch);
        System.out.println("Correspondance date: " + dateMatch);

        if (nomMatch && organismeMatch && dateMatch) {
          System.out.println("=== CORRESPONDANCE TROUVEE ===");
          System.out.println("Certification trouvée: " + certif.getNom());
          return ResponseEntity.ok("✅ Certification vérifiée avec succès : " + certif.getNom());
        } else {
          System.out.println("Aucune correspondance complète pour cette certification");
        }
      }

      System.out.println("=== AUCUNE CORRESPONDANCE ===");
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body("❌ Aucune correspondance trouvée dans la base de données.");

    } catch (Exception e) {
      System.err.println("=== ERREUR LORS DE LA VERIFICATION ===");
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body("Erreur lors de l'analyse de l'image : " + e.getMessage());
    }
  }

  private String prepareForMatching(String input) {
    return input.toLowerCase()
      .replaceAll("[^a-z0-9àâäéèêëîïôöùûüç]", " ")
      .replaceAll("\\s+", " ")
      .trim();
  }

  private String prepareDateForMatching(Date date) {
    LocalDate localDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    // Ajout du format avec espaces
    return String.format("%02d%02d%04d|%02d/%02d/%04d|%02d-%02d-%04d|%02d %02d %04d",
      localDate.getDayOfMonth(), localDate.getMonthValue(), localDate.getYear(),
      localDate.getDayOfMonth(), localDate.getMonthValue(), localDate.getYear(),
      localDate.getDayOfMonth(), localDate.getMonthValue(), localDate.getYear(),
      localDate.getDayOfMonth(), localDate.getMonthValue(), localDate.getYear());
  }

  private boolean containsWithTolerance(String text, String pattern) {
    // Tolérance aux fautes de frappe (distance de Levenshtein)
    text = " " + text + " "; // Pour permettre la recherche de mots entiers

    // Essayez d'abord une correspondance exacte
    if (text.contains(" " + pattern + " ")) {
      return true;
    }

    // Sinon, divisez le motif en mots et vérifiez chaque mot
    String[] words = pattern.split(" ");
    int matchedWords = 0;

    for (String word : words) {
      if (word.length() > 3 && text.contains(" " + word + " ")) {
        matchedWords++;
      }
    }

    // Accepte si au moins 50% des mots longs correspondent
    return words.length > 0 && (matchedWords * 100 / words.length) >= 50;
  }

  private boolean containsDate(String text, String datePatterns) {
    String[] patterns = datePatterns.split("\\|");
    for (String pattern : patterns) {
      // Permettre des séparateurs variables (/, -, espace)
      String flexiblePattern = pattern.replaceAll("[/-]", "[-/ ]");
      if (text.matches(".*\\b" + flexiblePattern + "\\b.*")) {
        return true;
      }
    }
    return false;
  }
}
