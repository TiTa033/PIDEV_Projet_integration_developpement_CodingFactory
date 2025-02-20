package com.example.stagetest;

import java.util.List;

public interface IServicesStages {
    List<Stage> getListOfStages();
    Stage getStageByid(Long id);
    Stage createStage(Stage stage);
    void deleteStage(Long id);
    Stage updateStage(Stage stage);
}
