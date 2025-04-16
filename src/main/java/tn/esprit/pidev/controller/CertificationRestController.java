package tn.esprit.pidev.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pidev.entities.Certification;
import tn.esprit.pidev.services.ICertificationService;
import tn.esprit.pidev.services.QRCodeGenerator;
import com.google.zxing.WriterException;
import java.io.IOException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
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
            // Extraire le texte de l'image via OCR
            String extractedText = ocrService.extractTextFromImage(imageFile);

            // Nettoyer et normaliser le texte extrait
            String normalizedExtractedText = extractedText.replaceAll("\\s+", " ").toLowerCase().replaceAll("[^a-zA-Z0-9\\s]", "");
            System.out.println("Texte extrait de l'image nettoyé : " + normalizedExtractedText);

            // Récupérer toutes les certifications depuis la base de données
            List<Certification> certifications = certificationService.retrieveAllCertifications();
            for (Certification certif : certifications) {
                // Normaliser les informations de la certification
                String normalizedNom = certif.getNom().toLowerCase().replaceAll("\\s+", " ");
                String normalizedOrganisme = certif.getOrganisme().toLowerCase().replaceAll("\\s+", " ");

                // Convertir la date de la certification en LocalDate (sans l'heure)
                String normalizedDate = certif.getDateObtention().toInstant()
                        .atZone(java.time.ZoneId.systemDefault())
                        .toLocalDate().toString(); // Format ISO: yyyy-MM-dd

                // Nettoyer la date extraite de l'image (format 'ddMMyyyy')
                String extractedDate = extractDateFromText(normalizedExtractedText); // Nouvelle méthode pour extraire la date

                // Affichage des informations de la certification pour inspection
                System.out.println("Nom: " + normalizedNom + ", Organisme: " + normalizedOrganisme + ", Date: " + normalizedDate);

                // Comparaison des données extraites avec les données de la base
                if (normalizedExtractedText.contains(normalizedNom) &&
                        normalizedExtractedText.contains(normalizedOrganisme) &&
                        extractedDate.equals(normalizedDate)) {

                    // Si une correspondance est trouvée
                    return ResponseEntity.ok("✅ Certification vérifiée avec succès : " + certif.getNom());
                }
            }

            // Si aucune correspondance n'est trouvée
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("❌ Aucune correspondance trouvée dans la base de données.");

        } catch (Exception e) {
            // En cas d'erreur, afficher un message d'erreur
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'analyse de l'image : " + e.getMessage());
        }
    }

    private String extractDateFromText(String text) {
        // Recherche de la date au format ddMMyyyy dans le texte
        String datePattern = "\\d{2}\\d{2}\\d{4}"; // Format ddMMyyyy
        Pattern pattern = Pattern.compile(datePattern);
        Matcher matcher = pattern.matcher(text);

        if (matcher.find()) {
            // Extraire la date et la convertir au format yyyy-MM-dd
            String dateStr = matcher.group();
            return dateStr.substring(4, 8) + "-" + dateStr.substring(2, 4) + "-" + dateStr.substring(0, 2); // Format ISO: yyyy-MM-dd
        }

        return ""; // Retourne une chaîne vide si aucune date n'est trouvée
    }
}
