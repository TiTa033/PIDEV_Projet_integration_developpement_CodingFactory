package tn.esprit.pidev.services;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.pidev.entities.Course;
import tn.esprit.pidev.entities.Evaluation;
import tn.esprit.pidev.repository.CourseRepository;
import tn.esprit.pidev.repository.EvaluationRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class EvaluationService implements IEvaluationService {

    EvaluationRepository evaluationRepository;
    //CourseRepository courseRepository;

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
        return evaluationRepository.save(evaluation);
    }

    @Override
    public void removeEvaluation(Long evaluationId) {
        evaluationRepository.deleteById(evaluationId);
    }

    @Override
    public Evaluation modifyEvaluation(Evaluation evaluation) {
        return evaluationRepository.save(evaluation);
    }

    /*public void addEvaluationToCourse(Long courseId, Evaluation evaluation) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));

        evaluation.setCourse(course);
        evaluationRepository.save(evaluation);
    }*/
}
