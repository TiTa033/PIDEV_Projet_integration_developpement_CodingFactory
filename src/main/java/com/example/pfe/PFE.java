package com.example.pfe;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class PFE {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titre;
    private String description;
    @Temporal(TemporalType.DATE)
    private Date dateSoumission;
    @Temporal(TemporalType.DATE)
    private Date deadline;
    public enum Etat {EnAttente, Validé, Rejeté}
    @Enumerated(EnumType.STRING)
    private Etat etat;
    private String rapportNom;
    private String rapportPath; // Replaced rapportData with rapportPath
    private Double plagiarismScore;

    // Default constructor
    public PFE() {
    }

    // Parameterized constructor
    public PFE(Long id, String titre, String description, Date dateSoumission, Date deadline, Etat etat,
               String rapportNom, String rapportPath, Double plagiarismScore) {
        this.id = id;
        this.titre = titre;
        this.description = description;
        this.dateSoumission = dateSoumission;
        this.deadline = deadline;
        this.etat = etat;
        this.rapportNom = rapportNom;
        this.rapportPath = rapportPath;
        this.plagiarismScore = plagiarismScore;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDateSoumission() {
        return dateSoumission;
    }

    public void setDateSoumission(Date dateSoumission) {
        this.dateSoumission = dateSoumission;
    }

    public Date getDeadline() {
        return deadline;
    }

    public void setDeadline(Date deadline) {
        this.deadline = deadline;
    }

    public Etat getEtat() {
        return etat;
    }

    public void setEtat(Etat etat) {
        this.etat = etat;
    }

    public String getRapportNom() {
        return rapportNom;
    }

    public void setRapportNom(String rapportNom) {
        this.rapportNom = rapportNom;
    }

    public String getRapportPath() {
        return rapportPath;
    }

    public void setRapportPath(String rapportPath) {
        this.rapportPath = rapportPath;
    }

    public Double getPlagiarismScore() {
        return plagiarismScore;
    }

    public void setPlagiarismScore(Double plagiarismScore) {
        this.plagiarismScore = plagiarismScore;
    }
}