package com.example.gestionbourses.services;

import com.example.gestionbourses.entities.Bourse;
import com.example.gestionbourses.repositories.BourseRepo;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@AllArgsConstructor
public class BourseServiceImpl implements IBourseService{

    @Autowired
    BourseRepo bourseRepo;
    /*@Value("${upload.path}")
    private String images;*/


    /*public String uploadImage(MultipartFile file) throws IOException {
        // Generate unique filename to avoid conflicts
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFileName;

        // Define the target path
        Path targetLocation = Paths.get(images).resolve(uniqueFileName);

        // Ensure upload directory exists
        if (!Files.exists(Paths.get(images))) {
            Files.createDirectories(Paths.get(images));
        }

        // Save the file
        Files.copy(file.getInputStream(), targetLocation);

        // Return the image URL
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/images/")
                .path(uniqueFileName)
                .toUriString();
    }*/

    public Bourse addBourse(Bourse bourse) {
        return bourseRepo.save(bourse);
    }

    public List<Bourse> getAllBourse() {
        List<Bourse> bourses = bourseRepo.findAll();
        return bourses;
    }

    public Bourse retrieveBourse(Long idBourse) {
        return bourseRepo.findById(idBourse).get();
    }

    public Bourse updateBourse(Long idBourse, Bourse bourse) {
        List<Bourse> bourses = bourseRepo.findAll();
        for (Bourse b : bourses) {
            if (b.getIdBourse().equals(idBourse)) { // Match by id parameter
                b.setNom(bourse.getNom());
                b.setType(bourse.getType());
                b.setMontant(bourse.getMontant());
                b.setNbplace(bourse.getNbplace());
                b.setDateDebut(bourse.getDateDebut());
                b.setDateFin(bourse.getDateFin());
                b.setConditions(bourse.getConditions());
                return bourseRepo.save(b); // Save the updated entity
            }
        }
        System.out.println("Bourse inexistante");
        return null; // Return null if no matching payment is found
    }


     /* public Bourse updateBourse(Bourse bourse) {
        List<Bourse> bourses = bourseRepo.findAll();
        for (Bourse p : bourses) {
            if (bourse.getIdBourse() == (p.getIdBourse())) {
                p.setMontant(bourse.getMontant());
                p.setDateEmission(bourse.getDateEmission());
                p.setDateEcheance(bourse.getDateEcheance());
                p.setEtatPaiement(bourse.getEtatPaiement());

            } else {
                System.out.println("bourse inexistante");
            }
        }
        return bourseRepo.save(bourse) ;

    }*/


    public void deleteBourse(Long idBourse) {
        bourseRepo.deleteById(idBourse);
    }


    public byte[] generateQRCodeImage(Long bourseId) throws WriterException, IOException {
        Bourse bourse = retrieveBourse(bourseId);
        if (bourse == null) throw new IllegalArgumentException("Bourse not found");

        String data = "Bourse ID: " + bourse.getIdBourse() +
                "\nNom: " + bourse.getNom() +
                "\nMontant: " + bourse.getMontant();

        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");

        BitMatrix bitMatrix = qrCodeWriter.encode(data, BarcodeFormat.QR_CODE, 300, 300, hints);

        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);

        return pngOutputStream.toByteArray();
    }

    @Override
    public List<Bourse> searchBoursesByNom(String nom) {
        return bourseRepo.findByNomContainingIgnoreCase(nom);
    }


}
