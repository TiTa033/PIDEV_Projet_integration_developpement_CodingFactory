package tn.esprit.pidev.services;

import com.google.zxing.*;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.kernel.pdf.extgstate.PdfExtGState;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import tn.esprit.pidev.entities.Certification;
import tn.esprit.pidev.repository.CertificationRepository;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Base64;
import java.util.List;

import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Image;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;

@Service
@AllArgsConstructor
public class CertificationService implements ICertificationService {

  private final CertificationRepository certificationRepository;
  private final EmailService emailService;

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
    List<Certification> existing = certificationRepository.findByNomAndOrganismeAndDateObtention(
      certification.getNom(),
      certification.getOrganisme(),
      certification.getDateObtention()
    );

    if (!existing.isEmpty()) {
      return existing.get(0);
    }

    Certification savedCertification = certificationRepository.save(certification);
    try {
      String qrText = generateQRCodeText(savedCertification);
      boolean isExpired = isCertificationExpired(savedCertification);
      int qrColor = isExpired ? 0xFFFF0000 : 0xFF00FF00; // Red if expired, green otherwise

      String qrCodeBase64 = QRCodeGenerator.generateQRCodeImage(qrText, 150, 150, qrColor, 0xFFFFFFFF);

      byte[] pdfBytes = generateCertificationPDF(savedCertification.getIdCertification());

      String subject = "Votre Certification " + savedCertification.getNom();
      String text = "<p>Félicitations,</p><p>Vous avez obtenu la certification : <b>" +
        savedCertification.getNom() + "</b>.</p>" +
        (isExpired ? "<p style='color:red;'>Attention: Cette certification a expiré!</p>" :
          "<p>Cette certification est valide.</p>");

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

    boolean isExpired = isCertificationExpired(certification);
    int qrColor = isExpired ? 0xFFFF0000 : 0xFF00FF00;

    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    PdfWriter writer = new PdfWriter(outputStream);
    PdfDocument pdf = new PdfDocument(writer);
    Document document = new Document(pdf);

    // Add certification info
    document.add(new Paragraph("Certification").setBold().setFontSize(18));
    document.add(new Paragraph("Nom : " + certification.getNom()));
    document.add(new Paragraph("Organisme : " + certification.getOrganisme()));
    document.add(new Paragraph("Date : " + certification.getDateObtention().toString()));

    // Add expiry status
    if (isExpired) {
      document.add(new Paragraph("Statut : EXPIRÉ").setFontColor(ColorConstants.RED));
    } else {
      document.add(new Paragraph("Statut : VALIDE").setFontColor(ColorConstants.GREEN));
    }

    // Generate QR Code
    String qrText = generateQRCodeText(certification);
    String qrCodeBase64 = QRCodeGenerator.generateQRCodeImage(qrText, 150, 150, qrColor, 0xFFFFFFFF);
    byte[] qrCodeBytes = Base64.getDecoder().decode(qrCodeBase64);
    ImageData imageData = ImageDataFactory.create(qrCodeBytes);
    Image qrImage = new Image(imageData).setWidth(100).setHeight(100);
    document.add(qrImage);

    // Add watermark
    for (int i = 1; i <= pdf.getNumberOfPages(); i++) {
      PdfPage page = pdf.getPage(i);
      PdfCanvas canvas = new PdfCanvas(page);
      canvas.saveState();

      PdfExtGState gs1 = new PdfExtGState();
      gs1.setFillOpacity(0.2f);
      canvas.setExtGState(gs1);

      canvas.beginText()
        .setFontAndSize(PdfFontFactory.createFont(), 50)
        .setColor(isExpired ? ColorConstants.RED : ColorConstants.GREEN, true)
        .moveText(150, 400)
        .showText(isExpired ? "CERTIFICAT EXPIRÉ" : "CERTIFICAT VALIDE")
        .endText();
      canvas.restoreState();
    }

    document.close();
    return outputStream.toByteArray();
  }

  private String generateQRCodeText(Certification certification) {
    return "Nom: " + certification.getNom() +
      "\nOrganisme: " + certification.getOrganisme() +
      "\nDate: " + certification.getDateObtention() +
      "\nStatut: " + (isCertificationExpired(certification) ? "EXPIRÉ" : "VALIDE");
  }

  public boolean isCertificationExpired(Certification certification) {
    LocalDate obtentionDate = certification.getDateObtention().toInstant()
      .atZone(ZoneId.systemDefault()).toLocalDate();
    LocalDate expiryDate = obtentionDate.plusYears(2);
    return LocalDate.now().isAfter(expiryDate);
  }

  @Scheduled(cron = "0 0 9 * * ?") // Runs daily at 9 AM
  public void checkExpiringCertifications() {
    LocalDate today = LocalDate.now();
    LocalDate warningDate = today.plusDays(30);

    certificationRepository.findAll().forEach(certification -> {
      LocalDate obtentionDate = certification.getDateObtention().toInstant()
        .atZone(ZoneId.systemDefault()).toLocalDate();
      LocalDate expiryDate = obtentionDate.plusYears(2);

      if (expiryDate.isEqual(warningDate)) {
        try {
          String subject = "Votre certification expire bientôt";
          String text = "Cher utilisateur,<br><br>" +
            "Votre certification <b>" + certification.getNom() + "</b> " +
            "va expirer le " + expiryDate + ".<br>" +
            "Pensez à la renouveler si nécessaire.";

          emailService.sendCertificationEmail(
            "malekbenslama0@gmail.com",
            subject,
            text,
            null,
            null
          );
        } catch (MessagingException e) {
          e.printStackTrace();
        }
      }
    });
  }
}
