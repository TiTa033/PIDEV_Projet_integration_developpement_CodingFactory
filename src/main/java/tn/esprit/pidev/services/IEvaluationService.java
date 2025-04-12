package tn.esprit.pidev.services;

import tn.esprit.pidev.entities.Evaluation;
import java.util.List;

public interface IEvaluationService {
  List<Evaluation> retrieveAllEvaluations();
  Evaluation retrieveEvaluation(Long evaluationId);
  Evaluation addEvaluation(Evaluation evaluation);
  void removeEvaluation(Long evaluationId);
  Evaluation modifyEvaluation(Evaluation evaluation);
  List<Evaluation> getUpcomingEvaluations();
  List<Evaluation> getCompletedEvaluations();
}
