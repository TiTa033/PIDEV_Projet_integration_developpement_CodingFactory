package tn.esprit.pidev.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.pidev.entities.Evaluation;
import java.util.Date;
import java.util.List;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
  List<Evaluation> findByDateEvaluationAfterOrderByDateEvaluationAsc(Date date);
}
