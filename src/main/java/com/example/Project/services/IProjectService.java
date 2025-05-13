package com.example.Project.services;

import com.example.Project.entities.Project;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

public interface IProjectService {
    List<String> uploadFiles(MultipartFile[] files) throws IOException;

    Project addProject(Project p, MultipartFile[] files);

    List<Project> getAllProjects();

    Project updateProject(Long id, String projectName, String projectDescription, String tags, MultipartFile[] files, boolean keepOldFiles);
    public void deleteProject(Long projectId) ;
    Project getProjectById(Long id);
    //Resource downloadFile(String fileName) throws  IOException;
    public File createZipForProjectFiles(Long projectId) throws IOException;
    public List<Project> searchProjects(String searchTerm) ;

    }
