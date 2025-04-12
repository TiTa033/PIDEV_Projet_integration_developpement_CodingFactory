package tn.esprit.pidev.entities;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Certification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCertification;

    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 5, message = "Le nom doit contenir au moins 5 caractères")
    private String nom;

    @NotBlank(message = "L'organisme est obligatoire")
    @Size(min = 3, message = "L'organisme doit contenir au moins 3 caractères")
    private String organisme;

    @NotNull(message = "La date d'obtention est obligatoire")
    @Column(columnDefinition = "TIMESTAMP")
    private Date dateObtention;

  @Column(columnDefinition = "TEXT")
    private String qrCodeBase64;

    @Lob
    private byte[] fichierPdf;

    /*@ManyToMany(mappedBy = "certifications")
    private List<Course> courses;
     */
}

