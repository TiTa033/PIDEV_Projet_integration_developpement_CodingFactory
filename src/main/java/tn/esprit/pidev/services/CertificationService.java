package tn.esprit.pidev.services;

import com.google.zxing.*;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.kernel.pdf.extgstate.PdfExtGState;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.pidev.entities.Certification;
import tn.esprit.pidev.repository.CertificationRepository;

import java.util.List;

import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Image;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

@Service
@AllArgsConstructor
public class CertificationService implements ICertificationService {

    CertificationRepository certificationRepository;
    EmailService emailService;

    @Override
    public List<Certification> retrieveAllCertifications() {
        return certificationRepository.findAll();
    }

    @Override
    public Certification retrieveCertification(Long certificationId) {
        return certificationRepository.findById(certificationId).orElse(null);
    }

    @Override
    public Certification addCertification(Certification certification) {
        Certification savedCertification = certificationRepository.save(certification);
        try {
            // Générer le QR code
            String qrText = "Nom: " + certification.getNom() +
                    "\nOrganisme: " + certification.getOrganisme() +
                    "\nDate: " + certification.getDateObtention();
            String qrCodeBase64 = QRCodeGenerator.generateQRCodeImage(qrText, 150, 150);

            // Mettre à jour le champ qrCodeBase64 dans l'entité Certification
            savedCertification.setQrCodeBase64(qrCodeBase64);

            // Sauvegarder l'entité avec le QR code mis à jour
            certificationRepository.save(savedCertification);

            // Générer le PDF du certificat
            byte[] pdfBytes = generateCertificationPDF(savedCertification.getIdCertification());

            // Envoi de l'email avec le certificat en pièce jointe
            String subject = "Votre Certification " + savedCertification.getNom();
            String text = "<p>Félicitations,</p><p>Vous avez obtenu la certification : <b>" + savedCertification.getNom() + "</b>.</p>";
            emailService.sendCertificationEmail(
                    "malekbenslama0@gmail.com",
                    subject,
                    text,
                    pdfBytes,
                    "certification_" + savedCertification.getIdCertification() + ".pdf"
            );
        } catch (IOException | WriterException | MessagingException e) {
            e.printStackTrace();
        }
        return savedCertification;
    }

    @Override
    public void removeCertification(Long certificationId) {
        certificationRepository.deleteById(certificationId);
    }

    @Override
    public Certification modifyCertification(Certification certification) {
        return certificationRepository.save(certification);
    }

    @Override
    public byte[] generateCertificationPDF(Long certificationId) throws IOException, WriterException {
        Certification certification = certificationRepository.findById(certificationId)
                .orElseThrow(() -> new RuntimeException("Certification non trouvée"));
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(outputStream);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);
        // Ajouter les informations du certificat
        document.add(new Paragraph("Certification").setBold().setFontSize(18));
        document.add(new Paragraph("Nom : " + certification.getNom()));
        document.add(new Paragraph("Organisme : " + certification.getOrganisme()));
        document.add(new Paragraph("Date : " + certification.getDateObtention().toString()));
        // Générer le QR Code
        String qrText = "Nom: " + certification.getNom() +
                "\nOrganisme: " + certification.getOrganisme() +
                "\nDate: " + certification.getDateObtention();
        String qrCodeBase64 = QRCodeGenerator.generateQRCodeImage(qrText, 150, 150);
        byte[] qrCodeBytes = Base64.getDecoder().decode(qrCodeBase64);
        ImageData imageData = ImageDataFactory.create(qrCodeBytes);
        Image qrImage = new Image(imageData).setWidth(100).setHeight(100);
        document.add(qrImage);
        // Ajouter le filigrane sur chaque page
        for (int i = 1; i <= pdf.getNumberOfPages(); i++) {
            PdfPage page = pdf.getPage(i);
            PdfCanvas canvas = new PdfCanvas(page);
            canvas.saveState();
            // Définir la transparence
            PdfExtGState gs1 = new PdfExtGState();
            gs1.setFillOpacity(0.2f); // Transparence à 20%
            canvas.setExtGState(gs1);
            // Définir le texte du filigrane
            canvas.beginText()
                    .setFontAndSize(PdfFontFactory.createFont(), 50)
                    .setColor(ColorConstants.LIGHT_GRAY, true)
                    .moveText(150, 400) // Position en diagonale
                    .showText("CERTIFICATION OFFICIELLE")
                    .endText();
            canvas.restoreState();
        }
        document.close();
        return outputStream.toByteArray();
    }
}