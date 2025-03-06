package com.example.stagetest;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StageServices implements IServicesStages {
    @Autowired
    private final StageRepository stageRepository;
    @Override
    public List<Stage> getListOfStages() {
        return stageRepository.findAll();
    }

    @Override
    public Stage createStage(Stage stage) {
        return stageRepository.save(stage);
    }

    @Override
    public Stage updateStage(Stage stage) {
        return stageRepository.save(stage);
    }

    @Override
    public void deleteStage(Long id) {
        stageRepository.deleteById(id);
    }

    @Override
    public Stage getStageByid(Long id) {
        return stageRepository.findById(id).orElse(null);
    }


}
