package com.example.pfe;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/pfe")
public class PFERestController {
    @Autowired
    private IPFEServices pfeService;

    // Soumettre un projet
    @PostMapping("/soumettre")
    public PFE soumettreProjet(@RequestBody PFE pfe) {
        return pfeService.soumettreProjet(pfe);
    }

    // Récupérer tous les projets
    @GetMapping("/projets")
    public List<PFE> getAllProjets() {
        return pfeService.getAllProjets();
    }

    // Récupérer un projet par son ID
    @GetMapping("/projets/{id}")
    public PFE getPFEByid(@PathVariable Long id) {
        return pfeService.getPFEByid(id);
    }

    // Évaluer un projet (changer son état)
    @PutMapping("/projets/{id}/evaluer")
    public PFE evaluerProjet(@PathVariable Long id, @RequestParam PFE.Etat etat) {
        return pfeService.evaluerProjet(id, etat);
    }

    // Supprimer un projet
    @DeleteMapping("/projets/{id}")
    public void supprimerProjet(@PathVariable Long id) {
        pfeService.supprimerProjet(id);
    }

    // Déposer un rapport pour un projet
    @PostMapping("/projets/{id}/rapport")
    public ResponseEntity<PFE> deposerRapport(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }
            byte[] fileData = file.getBytes();
            String fileName = file.getOriginalFilename();
            String fileType = file.getContentType();
            PFE updatedPFE = pfeService.deposerRapport(id, fileData, fileName);
            return ResponseEntity.ok(updatedPFE);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Télécharger un rapport
    @GetMapping("/projets/{id}/rapport")
    public ResponseEntity<byte[]> downloadRapport(@PathVariable Long id) {
        PFE pfe = pfeService.getPFEByid(id);
        if (pfe == null || pfe.getRapportPath() == null || pfe.getRapportNom() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        try {
            byte[] fileData = Files.readAllBytes(Paths.get(pfe.getRapportPath()));
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + pfe.getRapportNom() + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(fileData);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}