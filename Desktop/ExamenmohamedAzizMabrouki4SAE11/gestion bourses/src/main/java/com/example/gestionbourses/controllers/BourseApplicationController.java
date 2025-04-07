package com.example.gestionbourses.controllers;

import com.example.gestionbourses.entities.Bourse;
import com.example.gestionbourses.entities.BourseApplication;
import com.example.gestionbourses.repositories.BourseApplicationRepository;
import com.example.gestionbourses.repositories.BourseRepo;
import com.example.gestionbourses.services.IBourseApplicationService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/bourse/bourses")
@CrossOrigin(origins = "http://localhost:4200") // Change this if needed
public class BourseApplicationController {
    @Autowired
    private BourseRepo bourseRepository;


    @Autowired
    private IBourseApplicationService applicationService;

    @GetMapping("/appliedCounts")
    public ResponseEntity<Map<Long, Integer>> getAppliedCounts() {
        return ResponseEntity.ok(applicationService.getAppliedCounts());
    }


    @PostMapping(value = "/apply", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BourseApplication> applyForBourse(
            @RequestParam("applicantName") String applicantName,
            @RequestParam("email") String email,
            @RequestParam("bourseId") Long bourseId,
            @RequestParam("file") MultipartFile file) {

        try {
            String filePath = saveFile(file); // Save the file and get the path

            BourseApplication application = new BourseApplication();
            application.setApplicantName(applicantName);
            application.setEmail(email);
            application.setFilePath(filePath);

            // 🔥 Fetch the bourse entity
            Bourse bourse = bourseRepository.findById(bourseId)
                    .orElseThrow(() -> new RuntimeException("Bourse not found with ID: " + bourseId));

            application.setBourse(bourse); // ✅ Set the relationship

            BourseApplication savedApplication = applicationService.saveApplication(application);
            return ResponseEntity.ok(savedApplication);
        } catch (Exception e) {
            e.printStackTrace(); // Show actual error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    private String saveFile(MultipartFile file) throws IOException {
        // 👇 Set an absolute path for development
        String uploadDir = System.getProperty("user.home") + File.separator + "uploads";

        File uploadFolder = new File(uploadDir);
        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs(); // Create the folder if it doesn’t exist
        }

        String filePath = uploadDir + File.separator + file.getOriginalFilename();
        File dest = new File(filePath);
        file.transferTo(dest);

        return filePath;
    }

}
