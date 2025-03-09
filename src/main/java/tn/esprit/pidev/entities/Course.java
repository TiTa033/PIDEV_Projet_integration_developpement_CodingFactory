package tn.esprit.pidev.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCourse;

    @NotBlank(message = "Le titre ne peut pas être vide")
    @Size(min = 5, max = 100, message = "Le titre doit contenir entre 5 et 100 caractères")
    private String title;

    @NotBlank(message = "La description ne peut pas être vide")
    @Size(min = 10, max = 500, message = "La description doit contenir entre 10 et 500 caractères")
    private String description;

    @NotBlank(message = "Les objectifs ne peuvent pas être vides")
    @Size(min = 10, max = 300, message = "Les objectifs doivent contenir entre 10 et 300 caractères")
    private String objectives;
    private double rating = 0.0;
    private int ratingCount = 0;

    @ElementCollection
    private List<String> tags;

    /*@ManyToMany
    @JoinTable(
            name = "course_certification",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "certification_id")
    )
    private List<Certification> certifications;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Evaluation> evaluations;

     */
}