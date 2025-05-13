package com.example.gestionevent.service;

import com.example.gestionevent.entity.Event;
import com.google.zxing.WriterException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface IEventService {
     Event addEvent(Event event, MultipartFile imageFile);
    List<Event> getAllEvents();
    public void deleteEvent(Long eventId) ;
    Event updateEvent(Long eventId, Event eventDetails); // Add update method
    List<Event> searchEventByName(String name);
    public byte[] generateQRCodeForEvent(Long eventId) throws WriterException, IOException;
    public Map<String, Long> getEventStatusStats();
    public List<Map<String, String>> runPythonScraper();
    public byte[] participateInEvent(Long eventId, Integer userId, String username);


    }
