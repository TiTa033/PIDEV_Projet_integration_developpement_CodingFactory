package com.example.gestionevent.repository;

import com.example.gestionevent.entity.UserEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserEventRepository extends JpaRepository<UserEvent, Integer> {
    boolean existsByUserEmailAndEventId(String userEmail, Long eventId);
}