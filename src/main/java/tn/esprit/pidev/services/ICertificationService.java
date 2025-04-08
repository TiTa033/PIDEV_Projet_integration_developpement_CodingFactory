package tn.esprit.pidev.services;

import com.google.zxing.ChecksumException;
import com.google.zxing.FormatException;
import com.google.zxing.NotFoundException;
import com.google.zxing.WriterException;
import tn.esprit.pidev.entities.Certification;

import java.io.IOException;
import java.util.List;

public interface ICertificationService {
    List<Certification> retrieveAllCertifications();
    Certification retrieveCertification(Long certificationId);
    Certification addCertification(Certification certification);
    void removeCertification(Long certificationId);
    Certification modifyCertification(Certification certification);
    byte[] generateCertificationPDF(Long certificationId) throws IOException, WriterException;
}
