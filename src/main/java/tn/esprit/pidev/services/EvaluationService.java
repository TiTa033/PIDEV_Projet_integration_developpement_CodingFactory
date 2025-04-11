package tn.esprit.pidev.services;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.pidev.entities.Evaluation;
import tn.esprit.pidev.entities.Certification;
import tn.esprit.pidev.repository.EvaluationRepository;
import java.util.Date;
import java.util.List;

@Service
@AllArgsConstructor
public class EvaluationService implements IEvaluationService {

  EvaluationRepository evaluationRepository;
  CertificationService certificationService; // Add this

  @Override
  public List<Evaluation> retrieveAllEvaluations() {
    return evaluationRepository.findAll();
  }

  @Override
  public Evaluation retrieveEvaluation(Long evaluationId) {
    return evaluationRepository.findById(evaluationId).orElse(null);
  }

  @Override
  public Evaluation addEvaluation(Evaluation evaluation) {
    Evaluation savedEvaluation = evaluationRepository.save(evaluation);

    // Check if note is greater than 15
    if (evaluation.getNote() != null && evaluation.getNote() > 15) {
      createCertificationForEvaluation(savedEvaluation);
    }

    return savedEvaluation;
  }

  @Override
  public void removeEvaluation(Long evaluationId) {
    evaluationRepository.deleteById(evaluationId);
  }

  @Override
  public Evaluation modifyEvaluation(Evaluation evaluation) {
    Evaluation updatedEvaluation = evaluationRepository.save(evaluation);

    // Check if note is greater than 15
    if (evaluation.getNote() != null && evaluation.getNote() > 15) {
      createCertificationForEvaluation(updatedEvaluation);
    }

    return updatedEvaluation;
  }

  public List<Evaluation> getUpcomingEvaluations() {
    Date today = new Date();
    return evaluationRepository.findByDateEvaluationAfterOrderByDateEvaluationAsc(today);
  }

  private void createCertificationForEvaluation(Evaluation evaluation) {
    Certification certification = new Certification();
    certification.setNom("Certification Spring Backend - " + evaluation.getSujet());
    certification.setOrganisme("Pidev");
    certification.setDateObtention(new Date());
    certificationService.addCertification(certification);
  }
}
