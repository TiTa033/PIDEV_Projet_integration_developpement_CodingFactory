package com.example.gestionbourses.services;

import com.example.gestionbourses.entities.BourseApplication;
import com.example.gestionbourses.repositories.BourseApplicationRepository;
import com.example.gestionbourses.services.IBourseApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BourseApplicationService implements IBourseApplicationService {
    @Autowired
    private BourseApplicationRepository applicationRepository;

    public BourseApplication saveApplication(BourseApplication application) {
        return applicationRepository.save(application);
    }

    public Map<Long, Integer> getAppliedCounts() {
        List<Object[]> results = applicationRepository.countApplicationsByBourse();
        Map<Long, Integer> appliedCounts = new HashMap<>();

        for (Object[] row : results) {
            Long idBourse = (Long) row[0];
            Integer count = ((Number) row[1]).intValue();
            appliedCounts.put(idBourse, count);
        }
        return appliedCounts;
    }




}
