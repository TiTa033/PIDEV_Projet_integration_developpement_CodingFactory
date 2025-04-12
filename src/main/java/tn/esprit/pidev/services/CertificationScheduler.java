package tn.esprit.pidev.services;

import org.springframework.scheduling.annotation.Scheduled;
import tn.esprit.pidev.entities.Evaluation;
import tn.esprit.pidev.repository.EvaluationRepository;

import java.util.Date;
import java.util.List;

public class CertificationScheduler {

  private final EvaluationService evaluationService;
  private EvaluationRepository evaluationRepository;

  public CertificationScheduler(EvaluationService evaluationService) {
    this.evaluationService = evaluationService;
  }

  @Scheduled(cron = "0 0 0 * * ?")
  public void checkEvaluationsForCertifications() {
    Date now = new Date();
    List<Evaluation> evaluations = evaluationRepository.findByNoteGreaterThanEqualAndDateEvaluationBefore(15.0, now);

    for (Evaluation evaluation : evaluations) {
      // Cette méthode vérifiera automatiquement si la certification existe déjà
      evaluationService.checkAndCreateCertification(evaluation);
    }
  }
}
