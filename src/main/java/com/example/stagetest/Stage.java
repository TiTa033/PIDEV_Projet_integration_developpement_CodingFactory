package com.example.stagetest;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
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

    private Long etudiantId;  // Id de l'étudiant récupéré via `User-Service`

    private Long encadrantId; // Id de l'encadrant récupéré via `User-Service`

    private String nomEntreprise;
    public enum Statut {
        Disponible,Cloturé
    }

}