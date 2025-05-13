package com.example.gestionevent.repository;

import com.example.gestionevent.entity.Event;
import com.example.gestionevent.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event,Long> {
   List<Event> findByEventName(String name);
   @Query("SELECT e FROM Event e WHERE LOWER(e.eventName) LIKE LOWER(CONCAT('%', :name, '%'))")
   List<Event> findByEventNameContaining(@Param("name") String name);
   Long countByStatus(EventStatus status);
}
