package tn.esprit.pidev.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.Date;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEvaluation;
    @NotBlank(message = "Le sujet est obligatoire")
    @Size(min = 5, message = "Le sujet doit contenir au moins 5 caractères")
    private String sujet;

    @NotNull(message = "La note est obligatoire")
    @Min(value = 0, message = "La note doit être au minimum 0")
    @Max(value = 20, message = "La note doit être au maximum 20")
    private Double note;

    @NotNull(message = "La date d'évaluation est obligatoire")
    private Date dateEvaluation;

    /*@ManyToOne
    @JoinColumn(name = "course_id")
    @JsonManagedReference
    private Course course;
     */
}