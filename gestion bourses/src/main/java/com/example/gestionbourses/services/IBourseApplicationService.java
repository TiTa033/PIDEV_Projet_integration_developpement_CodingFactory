package com.example.gestionbourses.services;

import com.example.gestionbourses.entities.BourseApplication;

import java.util.Map;

public interface IBourseApplicationService {


   BourseApplication saveApplication(BourseApplication application);

    Map<Long, Integer> getAppliedCounts();




}
