package com.example.pfe;

import java.io.IOException;
import java.util.List;

public interface IPFEServices {
    PFE soumettreProjet(PFE pfe);

    // Récupérer tous les projets
    List<PFE> getAllProjets();

    // Récupérer un projet par son ID
    PFE getPFEByid(Long id);

    // Évaluer un projet (changer son état)
    PFE evaluerProjet(Long id, PFE.Etat etat);

    // Supprimer un projet
    void supprimerProjet(Long id);

    // Déposer un rapport pour un projet
    PFE deposerRapport(Long id, byte[] fileData, String fileName) throws IOException;}
