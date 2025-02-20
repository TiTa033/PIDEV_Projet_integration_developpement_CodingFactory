package com.example.stagetest;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/stages")
@CrossOrigin(origins = "http://localhost:4200")
@AllArgsConstructor
public class StageRestController {
    IServicesStages stageService;
    @GetMapping
    public List<Stage> getListOfStages() {
        return stageService.getListOfStages();
    }
    @PostMapping("/add-stage")
    public Stage createStage (@RequestBody Stage stage) {
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

}


