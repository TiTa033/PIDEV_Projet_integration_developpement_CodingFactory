package com.example.pfe;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@NoArgsConstructor
public class PFEServices implements IPFEServices {
    @Autowired
    private PFERepository pfeRepository;

    @Autowired
    private PlagiarismService plagiarismService;

    public PFE soumettreProjet(PFE pfe) {
        pfe.setDateSoumission(new Date());
        pfe.setEtat(PFE.Etat.EnAttente);
        return pfeRepository.save(pfe);
    }

    public List<PFE> getAllProjets() {
        return pfeRepository.findAll();
    }

    public PFE getPFEByid(Long id) {
        return pfeRepository.findById(id).orElse(null);
    }

    public PFE evaluerProjet(Long id, PFE.Etat etat) {
        Optional<PFE> projetOpt = pfeRepository.findById(id);
        if (projetOpt.isPresent()) {
            PFE pfe = projetOpt.get();
            pfe.setEtat(etat);
            return pfeRepository.save(pfe);
        }
        return null;
    }

    public void supprimerProjet(Long id) {
        PFE pfe = getPFEByid(id);
        if (pfe != null && pfe.getRapportPath() != null) {
            try {
                Files.deleteIfExists(Paths.get(pfe.getRapportPath()));
            } catch (IOException e) {
                // Log the error, but proceed with deletion
            }
        }
        pfeRepository.deleteById(id);
    }

    public PFE deposerRapport(Long id, byte[] fileData, String fileName) throws IOException {
        PFE pfe = getPFEByid(id);
        if (pfe == null) {
            throw new IllegalArgumentException("PFE not found with ID: " + id);
        }

        // Save file to disk
        String uploadDir = "uploads/";
        Files.createDirectories(Paths.get(uploadDir));
        String filePath = uploadDir + id + "_" + fileName;
        Files.write(Paths.get(filePath), fileData);

        // Update PFE with file path
        pfe.setRapportNom(fileName);
        pfe.setRapportPath(filePath);

        // Compute plagiarism score, passing the current PFE ID
        try {
            double plagiarismScore = plagiarismService.checkPlagiarism(fileData, pfe.getId());
            pfe.setPlagiarismScore(plagiarismScore);
        } catch (IOException e) {
            // Log the error and set a default score
            pfe.setPlagiarismScore(0.0);
        }

        return pfeRepository.save(pfe);
    }
}