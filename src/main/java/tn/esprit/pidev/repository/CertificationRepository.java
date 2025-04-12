package tn.esprit.pidev.repository;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.pidev.entities.Certification;

import java.util.Date;
import java.util.List;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, Long> {
    List<Certification> findByNomAndOrganismeAndDateObtention(@NotBlank(message = "Le nom est obligatoire") @Size(min = 5, message = "Le nom doit contenir au moins 5 caractères") String nom, @NotBlank(message = "L'organisme est obligatoire") @Size(min = 3, message = "L'organisme doit contenir au moins 3 caractères") String organisme, @NotNull(message = "La date d'obtention est obligatoire") Date dateObtention);
}
