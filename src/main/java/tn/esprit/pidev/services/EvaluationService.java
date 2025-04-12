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
  CertificationService certificationService;

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
    // Prevent adding evaluations with future dates and notes
    if (evaluation.getNote() != null && evaluation.getDateEvaluation().after(new Date())) {
      throw new IllegalArgumentException("Cannot add evaluation with future date and existing note");
    }

    Evaluation savedEvaluation = evaluationRepository.save(evaluation);
    checkAndCreateCertification(savedEvaluation);

    return savedEvaluation;
  }

  @Override
  public Evaluation modifyEvaluation(Evaluation evaluation) {
    // Prevent modifying evaluations to have future dates with notes
    if (evaluation.getNote() != null && evaluation.getDateEvaluation().after(new Date())) {
      throw new IllegalArgumentException("Cannot have evaluation with future date and existing note");
    }

    Evaluation updatedEvaluation = evaluationRepository.save(evaluation);
    checkAndCreateCertification(updatedEvaluation);

    return updatedEvaluation;
  }

  @Override
  public void removeEvaluation(Long evaluationId) {
    evaluationRepository.deleteById(evaluationId);
  }

  @Override
  public List<Evaluation> getUpcomingEvaluations() {
    Date today = new Date();
    return evaluationRepository.findByDateEvaluationAfterAndNoteIsNullOrderByDateEvaluationAsc(today);
  }

  @Override
  public List<Evaluation> getCompletedEvaluations() {
    Date today = new Date();
    return evaluationRepository.findByDateEvaluationBeforeOrNoteIsNotNullOrderByDateEvaluationDesc(today);
  }

  void checkAndCreateCertification(Evaluation evaluation) {

    if (evaluation.getNote() != null &&
      !evaluation.getDateEvaluation().after(new Date()) &&
      evaluation.getNote() >= 15.0) {

      createCertificationForEvaluation(evaluation);
    }
  }

  private void createCertificationForEvaluation(Evaluation evaluation) {
    Certification certification = new Certification();
    certification.setNom("Certification pour: " + evaluation.getSujet());
    certification.setOrganisme("Pidev");
    certification.setDateObtention(new Date());
    certificationService.addCertification(certification);
  }
}
