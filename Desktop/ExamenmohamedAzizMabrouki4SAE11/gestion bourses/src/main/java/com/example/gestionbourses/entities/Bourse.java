package com.example.gestionbourses.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Bourse {
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Id
     Long idBourse;
     String nom;
     Double montant;
     Type type;
     Integer nbplace;
     Date dateDebut;
    Date dateFin;
    String conditions;
    private String imageUrl = "/images/default-bourse-image.jpg";
}
