package tn.esprit.pidev.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.esprit.pidev.entities.PredictionRequestDTO;
import tn.esprit.pidev.services.MLPredictionService;

@RestController
@RequestMapping("/api/predict")
public class MLPredictionController {

    private final MLPredictionService mlPredictionService;

    @Autowired
    public MLPredictionController(MLPredictionService mlPredictionService) {
        this.mlPredictionService = mlPredictionService;
    }

    @PostMapping
    public Integer predictGrade(@RequestBody PredictionRequestDTO request) {
        System.out.println("Received request: " + request.toString());
        Integer result = mlPredictionService.predictGrade(request);
        System.out.println("Prediction result: " + result);
        return result;
    }
}
