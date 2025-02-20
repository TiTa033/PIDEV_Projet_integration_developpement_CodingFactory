package tn.esprit.pidev.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
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
    private String sujet;
    private Double note;
    private Date dateEvaluation;

    /*@ManyToOne
    @JoinColumn(name = "course_id")
    @JsonManagedReference
    private Course course;
     */
}