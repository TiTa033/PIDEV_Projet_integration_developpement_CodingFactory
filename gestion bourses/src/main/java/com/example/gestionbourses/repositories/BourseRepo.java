package com.example.gestionbourses.repositories;

import com.example.gestionbourses.entities.Bourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BourseRepo extends JpaRepository<Bourse,Long> {
    List<Bourse> findByNomContainingIgnoreCase(String nom);







    }
