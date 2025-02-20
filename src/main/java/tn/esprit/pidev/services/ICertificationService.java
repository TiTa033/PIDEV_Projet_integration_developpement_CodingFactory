package tn.esprit.pidev.services;

import tn.esprit.pidev.entities.Certification;

import java.util.List;

public interface ICertificationService {
    List<Certification> retrieveAllCertifications();
    Certification retrieveCertification(Long certificationId);
    Certification addCertification(Certification certification);
    void removeCertification(Long certificationId);
    Certification modifyCertification(Certification certification);
}
