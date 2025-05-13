package com.example.gestionevent.entity;

import com.example.gestionevent.entity.EventStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String eventName;
    private String eventDescription;
    private String organizer;

    @JsonFormat(pattern = "yyyy-MM-dd")  // ✅ Ensure correct date format
    private Date startDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date endDate;

    private Long maxParticipants;
    private Long registred;

    @Enumerated(EnumType.STRING)
    private EventStatus status;
    @Column(length = 1000)
    private String imagePath;
    private String createdByUser; //

    @ElementCollection
    private List<Integer> registeredUserIds = new ArrayList<>(); // IDs of users who registered


}
