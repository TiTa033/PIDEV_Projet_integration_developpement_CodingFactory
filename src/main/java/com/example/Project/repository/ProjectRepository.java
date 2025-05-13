package com.example.Project.repository;

import com.example.Project.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project,Long> {
    @Query("SELECT p FROM Project p WHERE LOWER(p.projectName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(p.tags) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Project> searchProjects(String searchTerm);
}
