package tn.esprit.pidev.controller;

import com.google.zxing.ChecksumException;
import com.google.zxing.FormatException;
import com.google.zxing.NotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pidev.entities.Certification;
import tn.esprit.pidev.services.ICertificationService;
import tn.esprit.pidev.services.QRCodeGenerator;
import com.google.zxing.WriterException;
import java.io.IOException;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@AllArgsConstructor
@RequestMapping("/certification")
public class CertificationRestController {

    private final ICertificationService certificationService;

    private String generateQRCodeText(Certification certification) {
        return "Nom: " + certification.getNom() +
                "\nOrganisme: " + certification.getOrganisme() +
                "\nDate: " + certification.getDateObtention();
    }

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

    @GetMapping("/generate-qrcode/{certification-id}")
    public ResponseEntity<String> generateQRCode(@PathVariable("certification-id") Long certificationId) {
        Certification certification = certificationService.retrieveCertification(certificationId);
        if (certification == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            String qrCodeBase64 = QRCodeGenerator.generateQRCodeImage(generateQRCodeText(certification), 300, 300);
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

    @GetMapping("/validate-certification")
    public ResponseEntity<String> validateCertification(@RequestParam("qrCode") String qrCodeBase64) throws ChecksumException, NotFoundException, IOException, FormatException {
        boolean isValid = certificationService.verifyCertification(qrCodeBase64);
        return ResponseEntity.status(isValid ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(isValid ? "Certificat valide" : "Certificat invalide");
    }
}
