package com.example.Project.services;

import com.example.Project.entities.Project;
import com.example.Project.repository.ProjectRepository;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
@AllArgsConstructor
public class ProjectServiceImpl implements IProjectService {
    private static final Logger logger = LoggerFactory.getLogger(ProjectServiceImpl.class);


    @Autowired
    ProjectRepository projectRepository;

    private final String uploadDir = "C:/Users/benti/IdeaProjects/Project/"; // Directory to save files

    // Handle file uploads
    public List<String> uploadFiles(MultipartFile[] files) throws IOException {
        List<String> filePaths = new ArrayList<>();

        // Create the upload directory if it doesn't exist
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
            logger.info("Created directory at: {}", uploadDir);  // Add logging for directory creation
        }

        // Iterate through each file, save it, and store the file path
        for (MultipartFile file : files) {
            String fileName = file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);  // Fixed: use Path correctly
            Files.write(filePath, file.getBytes());

            // Log the file upload details
            logger.info("Uploaded file: {} to path: {}", fileName, filePath.toString());
            filePaths.add(filePath.toString());
        }

        return filePaths;
    }


    @Override
    public Project addProject(Project p, MultipartFile[] files) {
        try {
            // Handle file upload and get the file paths
            List<String> filePaths = uploadFiles(files);

            // Set the file paths to the project object
            p.setFilePaths(filePaths);

            // Save the project to the database
            return projectRepository.save(p);
        } catch (IOException e) {
            logger.error("Error while uploading files for project: {}", p.getProjectName(), e);
            return null; // Handle the error (you can throw a custom exception if necessary)
        }
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll(); // Fetch all projects from the repository
    }

    public Project updateProject(Long id, String projectName, String projectDescription, String tags, MultipartFile[] files, boolean keepOldFiles) {
        // Fetch the existing project from the repository
        Project existingProject = projectRepository.findById(id).orElse(null);

        if (existingProject == null) {
            return null; // Handle the case where the project does not exist (or throw an exception)
        }

        // Update project details
        existingProject.setProjectName(projectName);
        existingProject.setProjectDescription(projectDescription);
        existingProject.setTags(tags);

        // Handle file upload
        if (files != null && files.length > 0) {
            try {
                List<String> newFilePaths = uploadFiles(files);

                if (keepOldFiles) {
                    // Preserve existing files and append new ones
                    List<String> existingFilePaths = existingProject.getFilePaths();
                    if (existingFilePaths == null) {
                        existingFilePaths = new ArrayList<>();
                    }
                    existingFilePaths.addAll(newFilePaths);
                    existingProject.setFilePaths(existingFilePaths);
                } else {
                    // Replace old files with new ones
                    existingProject.setFilePaths(newFilePaths);
                }
            } catch (IOException e) {
                logger.error("Error while uploading new files for project: {}", existingProject.getProjectName(), e);
                // Handle the error (you can throw a custom exception if necessary)
            }
        }

        // Save and return the updated project
        return projectRepository.save(existingProject);
    }

    public void deleteProject(Long projectId) {
        projectRepository.deleteById(projectId);
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id).orElse(null); // Return project if found, otherwise return null
    }

    // New method for downloading files
   /* public Resource downloadFile(String fileName) throws IOException {
        Path filePath = Paths.get(uploadDir, fileName); // Adjust the path accordingly
        if (Files.exists(filePath)) {
            return new UrlResource(filePath.toUri());
        } else {
            throw new FileNotFoundException("File not found: " + fileName);
        }
    }*/

    // Method to create a ZIP file of all project files
    public File createZipForProjectFiles(Long projectId) throws IOException {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        List<String> filePaths = project.getFilePaths(); // Assuming the project entity has a field called 'filePaths'

        // Define the name and location of the ZIP file
        Path zipFilePath = Paths.get(uploadDir, "project_" + projectId + "_files.zip");
        logger.info("Creating ZIP file at: {}", zipFilePath.toString());

        try (FileOutputStream fos = new FileOutputStream(zipFilePath.toFile());
             ZipOutputStream zos = new ZipOutputStream(fos)) {

            for (String filePath : filePaths) {
                // Resolve the full path of the file
                Path path = Paths.get(uploadDir).resolve(filePath).normalize();

                // Log the file path and check if the file exists
                logger.info("Adding file to ZIP: {}", path.toString());

                if (Files.exists(path)) {
                    // Add the file to the ZIP
                    ZipEntry zipEntry = new ZipEntry(path.getFileName().toString());
                    zos.putNextEntry(zipEntry);
                    Files.copy(path, zos);
                    zos.closeEntry();
                } else {
                    logger.warn("File not found: {}", path.toString());
                }
            }
        }

        return zipFilePath.toFile(); // Return the ZIP file to be served for download
    }


    public List<Project> searchProjects(String searchTerm) {
        return projectRepository.searchProjects(searchTerm);
    }

}
