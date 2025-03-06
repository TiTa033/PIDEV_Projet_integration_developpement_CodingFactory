package com.example.stagetest;

import java.util.List;

class EtudiantStatique {
    private Long id;
    private String nom;
    private List<Stage.Technologie> competences;

    public EtudiantStatique(Long id, String nom, List<Stage.Technologie> competences) {
        this.id = id;
        this.nom = nom;
        this.competences = competences;
    }

    public Long getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public List<Stage.Technologie> getCompetences() {
        return competences;
    }
}
