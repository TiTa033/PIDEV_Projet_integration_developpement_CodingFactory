package com.example.Project.controllers;

import com.example.Project.entities.Project;
import com.example.Project.services.IProjectService;
import lombok.AllArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@RestController
@AllArgsConstructor
@RequestMapping("/projects")
@CrossOrigin(origins = "http://localhost:4200")
public class ProjectController {
    private static final Logger logger = LoggerFactory.getLogger(ProjectController.class);

    IProjectService projectService;

    // http://localhost:8082/project/projects/add-project
    @PostMapping("/add-project")
    public ResponseEntity<Project> addProject(@RequestParam("projectName") String projectName,
                                              @RequestParam("projectDescription") String projectDescription,
                                              @RequestParam("tags") String tags,
                                              @RequestParam("files") MultipartFile[] files) {
        try {
            // Create the project object and set its details
            Project project = new Project();
            project.setProjectName(projectName);
            project.setProjectDescription(projectDescription);
            project.setTags(tags);

            // Call the service to handle project creation and file upload
            Project savedProject = projectService.addProject(project, files);

            if (savedProject != null) {
                return ResponseEntity.ok(savedProject);
            } else {
                return ResponseEntity.status(500).body(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
    //http://localhost:8082/project/projects/all-projectsx
    @GetMapping("/all-projects")
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    // http://localhost:8082/project/projects/update-project/{id}
    @PutMapping("/update-project/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id,
                                                 @RequestParam String projectName,
                                                 @RequestParam String projectDescription,
                                                 @RequestParam String tags,
                                                 @RequestParam(value = "files", required = false) MultipartFile[] files,
                                                 @RequestParam boolean keepOldFiles) {
        Project updatedProject = projectService.updateProject(id, projectName, projectDescription, tags, files, keepOldFiles);

        if (updatedProject != null) {
            return ResponseEntity.ok(updatedProject);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/delete-project/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable("id") Long projectId) {
        projectService.deleteProject(projectId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/get-project/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable("id") Long id) {
        Project project = projectService.getProjectById(id);
        return project != null ? ResponseEntity.ok(project) : ResponseEntity.notFound().build();
    }

    @GetMapping("/projects/download/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) throws MalformedURLException {
        Path filePath = Paths.get("uploads").resolve(filename).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }

    @CrossOrigin(origins = "http://localhost:4200")

    @GetMapping("/{projectId}/download")
    public ResponseEntity<Resource> downloadAllProjectFiles(@PathVariable Long projectId) {
        try {
            // Create the zip file containing all project files
            File zipFile = projectService.createZipForProjectFiles(projectId);

            // Log the location of the ZIP file
            logger.info("ZIP file created at: {}", zipFile.getAbsolutePath());

            // Check if the ZIP file exists before sending it
            if (!zipFile.exists()) {
                logger.error("ZIP file does not exist: {}", zipFile.getAbsolutePath());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // Prepare the response with the zip file
            Resource fileResource = new FileSystemResource(zipFile);

            if (!fileResource.exists()) {
                logger.error("Failed to load the ZIP file: {}", zipFile.getAbsolutePath());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }

            // Set appropriate headers and return the file as an attachment
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + zipFile.getName())
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(fileResource);

        } catch (IOException e) {
            logger.error("Error occurred while creating or downloading the ZIP file for projectId: {}", projectId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @GetMapping("/search")
    public List<Project> searchProjects(@RequestParam String query) {
        return projectService.searchProjects(query);
    }






}
