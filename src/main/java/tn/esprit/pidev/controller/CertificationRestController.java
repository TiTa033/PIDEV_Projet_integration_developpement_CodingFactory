package tn.esprit.pidev.controller;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pidev.entities.Certification;
import tn.esprit.pidev.services.ICertificationService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@AllArgsConstructor
@RequestMapping("/certification")
public class CertificationRestController {

    ICertificationService certificationService;

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
}
