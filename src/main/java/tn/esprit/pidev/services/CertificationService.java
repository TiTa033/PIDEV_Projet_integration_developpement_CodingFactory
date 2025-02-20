package tn.esprit.pidev.services;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.pidev.entities.Certification;
import tn.esprit.pidev.repository.CertificationRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class CertificationService implements ICertificationService {

    CertificationRepository certificationRepository;

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
        return certificationRepository.save(certification);
    }

    @Override
    public void removeCertification(Long certificationId) {
        certificationRepository.deleteById(certificationId);
    }

    @Override
    public Certification modifyCertification(Certification certification) {
        return certificationRepository.save(certification);
    }
}
