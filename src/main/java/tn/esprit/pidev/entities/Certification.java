package tn.esprit.pidev.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Certification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCertification;

    private String nom;
    private String organisme;
    private Date dateObtention;

    /*@ManyToMany(mappedBy = "certifications")
    private List<Course> courses;

     */
}

