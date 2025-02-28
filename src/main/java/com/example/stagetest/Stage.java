package com.example.stagetest;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Stage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sujet;

    private LocalDate dateDebut;

    private LocalDate dateFin;

    @Enumerated(EnumType.STRING)
    private Statut statut;

    @Enumerated(EnumType.STRING)
    private TypeStage typeStage;

    private String etudiantNom;  // Nom de l'étudiant récupéré via `User-Service`

    private String encadrantNom; // Nom de l'encadrant récupéré via `User-Service`

    private String nomEntreprise;
    public enum Statut {
        Disponible,Cloturé
    }
    public enum TypeStage {
        Stage_Immersion_En_Entreprise , StagePFE
    }
    /*@ElementCollection
    private List<String> RapportPaths = new ArrayList<>();*/
}