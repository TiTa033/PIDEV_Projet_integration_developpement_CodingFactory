package com.example.gestionbourses.repositories;

import com.example.gestionbourses.entities.BourseApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BourseApplicationRepository extends JpaRepository<BourseApplication, Long> {

    @Query("SELECT a.bourse.idBourse, COUNT(a) FROM BourseApplication a GROUP BY a.bourse.idBourse")
    List<Object[]> countApplicationsByBourse();


}
