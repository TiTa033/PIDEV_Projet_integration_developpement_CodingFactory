package com.example.gestionbourses.entities;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "bourse_applications")
public class BourseApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String applicantName;
    private String email;

    @ManyToOne
    @JoinColumn(name = "bourse_id")
    private Bourse bourse;  // Link to existing Bourse entity

    private String filePath; // Store file path or URL

    // Getters and Setters
}
