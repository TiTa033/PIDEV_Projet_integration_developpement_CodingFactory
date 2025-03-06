package com.example.stagetest;
import com.example.stagetest.Stage;
import com.example.stagetest.StageRepository;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
@Service
public class AttestationService {
    @Autowired
    private StageRepository stageRepository;

    public byte[] genererAttestation(Long stageId) throws IOException {
        Optional<Stage> stageOpt = stageRepository.findById(stageId);
        if (stageOpt.isEmpty()) {
            throw new IllegalArgumentException("Stage introuvable !");
        }
        Stage stage = stageOpt.get();

        // Création du document PDF
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(outputStream);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Définition de la police
        PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);

        // Ajout du titre
        document.add(new Paragraph("Attestation de Stage")
                .setFont(font)
                .setFontSize(20)
                .setBold()
                .setUnderline()
                .setTextAlignment(TextAlignment.CENTER)); //


        // Ajout du contenu
        document.add(new Paragraph("\n\nNous, l'entreprise " + stage.getNomEntreprise() + ", attestons que :\n")
                .setFontSize(12));

        document.add(new Paragraph("Nom de l'étudiant : " + stage.getEtudiantNom())
                .setFontSize(12));

        document.add(new Paragraph("Encadrant : " + stage.getEncadrantNom())
                .setFontSize(12));

        document.add(new Paragraph("Sujet du stage : " + stage.getSujet())
                .setFontSize(12));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        document.add(new Paragraph("Durée : du " + stage.getDateDebut().format(formatter)
                + " au " + stage.getDateFin().format(formatter))
                .setFontSize(12));

        document.add(new Paragraph("\nDurant ce stage, l'étudiant a travaillé avec les technologies suivantes : " +
                stage.getTechnologies())
                .setFontSize(12));

        document.add(new Paragraph("\nFait à " + stage.getNomEntreprise() + ", le " + LocalDate.now().format(formatter))
                .setFontSize(12));

        document.add(new Paragraph("\nSignature de l'entreprise\n\n__________________________")
                .setFontSize(12));

        // Fermeture du document
        document.close();
        return outputStream.toByteArray();
    }
}
