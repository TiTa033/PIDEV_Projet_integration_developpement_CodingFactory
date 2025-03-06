package com.example.stagetest;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/stages")
@CrossOrigin(origins = "http://localhost:4200")
@AllArgsConstructor
public class StageRestController {
    IServicesStages stageService;
    private final RecommandationService recommandationService;
    @GetMapping("/recommend/{etudiantId}")
    public List<Stage> recommanderStages(@PathVariable Long etudiantId) {
        return recommandationService.recommanderStages(etudiantId);
    }
    @GetMapping
    public List<Stage> getListOfStages() {
        return stageService.getListOfStages();
    }

    @PostMapping("/add-stage")
    public Stage createStage(@RequestBody Stage stage) {
        return stageService.createStage(stage);
    }

    @PutMapping("/modifier-stage")
    public Stage updateStage(@RequestBody Stage stage) {
        return stageService.updateStage(stage);
    }

    @DeleteMapping("/{id}")
    public void deleteStage(@PathVariable Long id) {
        stageService.deleteStage(id);
    }

    @GetMapping("/{id}")
    public Stage getStageById(@PathVariable Long id) {
        return stageService.getStageByid(id);
    }
}

