package tn.esprit.pidev.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pidev.entities.Evaluation;
import tn.esprit.pidev.services.IEvaluationService;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@AllArgsConstructor
@RequestMapping("/evaluation")
public class EvaluationRestController {

  IEvaluationService evaluationService;

  @GetMapping("/retrieve-all-evaluations")
  public List<Evaluation> getEvaluations() {
    return evaluationService.retrieveAllEvaluations();
  }

  @GetMapping("/retrieve-evaluation/{evaluation-id}")
  public Evaluation retrieveEvaluation(@PathVariable("evaluation-id") Long evaluationId) {
    return evaluationService.retrieveEvaluation(evaluationId);
  }

  @PostMapping("/add-evaluation")
  public Evaluation addEvaluation(@RequestBody Evaluation evaluation) {
    return evaluationService.addEvaluation(evaluation);
  }

  @DeleteMapping("/remove-evaluation/{evaluation-id}")
  public void removeEvaluation(@PathVariable("evaluation-id") Long evaluationId) {
    evaluationService.removeEvaluation(evaluationId);
  }

  @PutMapping("/modify-evaluation")
  public Evaluation modifyEvaluation(@RequestBody Evaluation evaluation) {
    return evaluationService.modifyEvaluation(evaluation);
  }

  @GetMapping("/upcoming-evaluations")
  public List<Evaluation> getUpcomingEvaluations() {
    return evaluationService.getUpcomingEvaluations();
  }
}
