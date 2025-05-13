package com.example.Project.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id; // Clé primaire
    String projectName;
    String projectDescription;
    String tags;
    @ElementCollection
    private List<String> filePaths = new ArrayList<>();


}
