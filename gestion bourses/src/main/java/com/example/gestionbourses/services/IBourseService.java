package com.example.gestionbourses.services;

import com.example.gestionbourses.entities.Bourse;
import com.google.zxing.WriterException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;

public interface IBourseService {


    Bourse addBourse (Bourse paiment);
    List<Bourse> getAllBourse();
    Bourse retrieveBourse(Long idBourse);

    Bourse updateBourse(Long idBourse, Bourse paiment);
    void deleteBourse(Long idBourse);



    byte[] generateQRCodeImage(Long bourseId) throws WriterException, IOException;


    List<Bourse> searchBoursesByNom(String nom);

}
