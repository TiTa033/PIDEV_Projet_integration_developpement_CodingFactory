package com.example.stagetest;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RecommandationService {
    private final StageRepository stageRepository;
    private static final List<EtudiantStatique> etudiants = Arrays.asList(
            new EtudiantStatique(1L, "Alice", Arrays.asList(Stage.Technologie.JAVA, Stage.Technologie.SPRING)),
            new EtudiantStatique(2L, "Bob", Arrays.asList(Stage.Technologie.PYTHON, Stage.Technologie.DOTNET)),
            new EtudiantStatique(3L, "Charlie", Arrays.asList(Stage.Technologie.JAVASCRIPT, Stage.Technologie.ANGULAR))
    );

    public List<Stage> recommanderStages(Long etudiantId) {
        EtudiantStatique etudiant = etudiants.stream()
                .filter(e -> e.getId().equals(etudiantId))
                .findFirst()
                .orElse(null);
        if (etudiant == null) return List.of();

        return stageRepository.findAll().stream()
                .filter(stage -> stage.getStatut() == Stage.Statut.AVAILABLE)
                .map(stage -> new StageScore(stage, scoreCompatibilite(stage, etudiant)))
                .filter(stageScore -> stageScore.score > 0) // Filtrer les stages sans compatibilité
                .sorted(Comparator.comparingInt(stageScore -> -stageScore.score))
                .limit(5)
                .map(stageScore -> stageScore.stage)
                .collect(Collectors.toList());
    }

    private int scoreCompatibilite(Stage stage, EtudiantStatique etudiant) {
        return (int) stage.getTechnologies().stream()
                .filter(etudiant.getCompetences()::contains)
                .count();
    }

    private static class StageScore {
        Stage stage;
        int score;

        public StageScore(Stage stage, int score) {
            this.stage = stage;
            this.score = score;
        }
    }

}